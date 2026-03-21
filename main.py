import os
import uuid
import asyncio
from flask import Flask, request, jsonify
from flask_cors import CORS
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from agent import AGENTS, AGENT_INFO

app = Flask(__name__)
CORS(app)

APP_NAME = "miacompass_hub"

session_service = InMemorySessionService()

runners: dict[str, Runner] = {
    agent_id: Runner(
        agent=agent,
        app_name=APP_NAME,
        session_service=session_service,
    )
    for agent_id, agent in AGENTS.items()
}


async def _ensure_session(user_id: str, session_id: str) -> None:
    existing = await session_service.get_session(
        app_name=APP_NAME,
        user_id=user_id,
        session_id=session_id,
    )
    if existing is None:
        await session_service.create_session(
            app_name=APP_NAME,
            user_id=user_id,
            session_id=session_id,
        )


async def _run_agent(agent_id: str, user_id: str, session_id: str, message: str) -> str:
    await _ensure_session(user_id, session_id)

    runner = runners[agent_id]
    user_content = types.Content(
        role="user",
        parts=[types.Part(text=message)],
    )

    reply_parts: list[str] = []
    async for event in runner.run_async(
        user_id=user_id,
        session_id=session_id,
        new_message=user_content,
    ):
        if event.is_final_response() and event.content:
            for part in event.content.parts:
                if part.text:
                    reply_parts.append(part.text)

    return "".join(reply_parts).strip()


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "miacompass-adk-server"})


@app.route("/api/agents", methods=["GET"])
def list_agents():
    return jsonify({"agents": AGENT_INFO})


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    message = (data.get("message") or "").strip()
    agent_id = (data.get("agent_id") or "resource_navigator").strip()
    user_id = (data.get("user_id") or "anonymous").strip()
    session_id = (data.get("session_id") or str(uuid.uuid4())).strip()

    if not message:
        return jsonify({"error": "message is required"}), 400

    if agent_id not in runners:
        return jsonify({"error": f"Unknown agent '{agent_id}'"}), 400

    try:
        reply = asyncio.run(_run_agent(agent_id, user_id, session_id, message))
    except Exception as exc:
        app.logger.error("ADK runner error: %s", exc)
        return jsonify({"error": "Agent failed to respond. Please try again."}), 500

    reply = reply or "I'm sorry, I couldn't generate a response. Please try again."

    return jsonify({
        "reply": reply,
        "agent_id": agent_id,
        "session_id": session_id,
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
