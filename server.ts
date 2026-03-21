import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";

async function startServer() {
    const app = express();
    const PORT = 3000;

    app.use(cors());
    app.use(express.json());

    // API routes
    app.get("/api/health", (req, res) => {
        res.json({ status: "ok" });
    });

    app.get("/api/directions", async (req, res) => {
        const { origin, destination } = req.query;
        const apiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: "Google Maps API key not configured" });
        }

        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin as string)}&destination=${encodeURIComponent(destination as string)}&mode=transit&alternatives=true&key=${apiKey}`
            );
            const data = await response.json();
            res.json(data);
        } catch (error) {
            console.error("Directions API error:", error);
            res.status(500).json({ error: "Failed to fetch directions" });
        }
    });

    // Vite middleware for development
    if (process.env.NODE_ENV !== "production") {
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: "spa",
        });
        app.use(vite.middlewares);
    } else {
        const distPath = path.join(process.cwd(), 'dist');
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
            res.sendFile(path.join(distPath, 'index.html'));
        });
    }

    // Serve static files (including index.html)
    app.use(express.static('static'));

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

startServer();
