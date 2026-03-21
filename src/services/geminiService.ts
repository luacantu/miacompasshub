import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 1. Intake Agent: Parses survey and determines tier/language/urgency
async function intakeAgent(surveyData: any) {
    console.log("Intake Agent starting...");
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `
                You are the Intake Agent for MIACompass Hub. 
                Your task is to parse the user's survey data and determine:
                1. Resource Tier:
                   - FULL: If zip code is in Miami-Dade (330xx-333xx).
                   - STATE: If in Florida but not Miami-Dade.
                   - FEDERAL: If outside Florida.
                2. Language: Detect if the user prefers English (EN) or Spanish (ES).
                3. Urgency: CRITICAL, HIGH, or NORMAL.
                4. Special Flags: veteran, immigrant, senior, student, family_with_children.
                
                Survey Data: ${JSON.stringify(surveyData)}
                
                Output a structured JSON summary of these findings.
            `,
            config: { responseMimeType: "application/json" }
        });
        const text = response.text || "{}";
        console.log("Intake Agent response:", text);
        return JSON.parse(text);
    } catch (error) {
        console.error("Intake Agent failed:", error);
        return { tier: 'FEDERAL', language: 'EN', urgency: 'NORMAL', flags: [] };
    }
}

// 2. Research Agent: Uses hardcoded knowledge + Google Search
async function researchAgent(intakeSummary: any) {
    console.log("Research Agent starting...");
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `
                You are the Research Agent. Use the provided hardcoded knowledge base and Google Search to find real programs.
                
                KNOWLEDGE BASE:
                FEDERAL: SNAP (dcf.state.fl.us), WIC (myflfamilies.com/wic), HUD Section 8 (miamidade.gov/housing), Medicaid (access.florida.gov), Medicare (medicare.gov), ACA Marketplace (healthcare.gov), CHIP (kidsandmedicaid.org), SSDI/SSI (ssa.gov), VA Benefits (va.gov), GI Bill (va.gov/education), Head Start
                
                FLORIDA: Florida SNAP/TANF (access.florida.gov), Reemployment Assistance (floridajobs.org), Florida Medicaid (myfloridahealthcare.com), Florida KidCare (floridakidcare.org), Florida Housing Finance Corp (floridahousing.org), SHIP Program (miamidade.gov/housing), Bright Futures Scholarship (floridastudentfinancialaidsg.org), FSAG grant, CareerSource Florida (careersourceflorida.com), VPK (vpkhelp.com), School Readiness (myfamilies.com/childcare)
                
                MIAMI-DADE HOUSING: ERAP (housingportalmdc.com), Public Housing (miamidade.gov/housing), Camillus House (camillus.org), Homeless Trust (211), Catholic Charities (305-754-2444)
                
                MIAMI-DADE FOOD: Daily Bread (dailybreadmiami.org), Feeding South Florida (feedingsouthflorida.org), LHANC (305-644-2010), Senior Meals (miamidade.gov/elderly)
                
                MIAMI-DADE HEALTH: Jackson Health Charity Care (jacksonhealth.org), Jessie Trice FQHC (305-637-4300), Borinquen Medical Centers (305-576-6611), Mental Health (211), Ryan White (305-375-5671)
                
                MIAMI-DADE UTILITIES: LIHEAP (miamidade.gov/csd), FPL Care To Share (fpl.com/care), Water hardship (305-665-7477)
                
                MIAMI-DADE LEGAL: Legal Aid (legalaidmiamidade.org), Americans for Immigrant Justice (aijustice.org), Catholic Legal Services (305-754-2444)
                
                MIAMI-DADE CHILDCARE: Head Start (communityactionagency.com), School Readiness Coalition (mdsrc.org)
                
                MIAMI-DADE VETERANS: Miami VA Medical Center (305-575-7000), Miami Vet Center (305-718-3400)
                
                MIAMI-DADE TRANSPORT: MDT bus/rail (miamidade.gov/transit), Free seniors 65+, Reduced disability, Medicaid transport (1-855-832-6740)
                
                EDUCATION MIAMI-DADE: MDC Florida College Promise (mdc.edu), MDC Continuing Ed (mdc.edu/ce), FIU financial aid (finaid.fiu.edu), CareerSource South Florida (careersourcesfl.com), Robert Morgan Educational Center (robertmorganed.com), Free GED/Adult Ed (dadeschools.net/adults), Free ESOL English classes, Bright Futures, MDC EASE Grant
                
                NEIGHBORHOODS:
                Hialeah: Housing Authority (305-556-3500), CareerSource Hialeah (305-364-3060)
                Miami Beach: Housing Authority (305-532-6401), Mount Sinai charity care (305-674-2121)
                Homestead: Armor Health FQHC (305-247-4956), CareerSource South Dade (305-242-1500)
                North Miami: Social Services (305-895-9878)
                Little Havana: LHANC (305-644-2010), Catholic Charities (305-754-2444)
                Little Haiti: Sant La (305-756-8080)
                Overtown/Liberty City: Overtown Youth Center (305-375-6990), CAA (305-751-8306)
                Coral Gables: Senior Center (305-460-5600)
                
                Intake Summary: ${JSON.stringify(intakeSummary)}
                
                Find programs that match the intake summary. Do not invent programs.
                Use Google Search if needed to verify details.
            `,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });
        console.log("Research Agent finished.");
        return response.text;
    } catch (error) {
        console.error("Research Agent failed:", error);
        return "Error finding programs.";
    }
}

// 3. Eligibility Agent: Filters and ranks
async function eligibilityAgent(researchResults: string, intakeSummary: any) {
    console.log("Eligibility Agent starting...");
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `
                You are the Eligibility Agent. Filter the programs found by the research agent.
                - Mark as Likely or Possible.
                - Remove ineligible programs based on user profile (age, income, family).
                - Rank by Urgency, then Impact, then Ease.
                - Organize by Tier: Federal, Florida, Miami-Dade, Neighborhood.
                
                Research Results: ${researchResults}
                Intake Summary: ${JSON.stringify(intakeSummary)}
            `
        });
        console.log("Eligibility Agent finished.");
        return response.text;
    } catch (error) {
        console.error("Eligibility Agent failed:", error);
        return "Error filtering programs.";
    }
}

// 4. Action Plan Agent: Writes the personalized plan
async function actionPlanAgent(eligibilityResults: string, intakeSummary: any) {
    console.log("Action Plan Agent starting...");
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `
                You are the Action Plan Agent. Write a personalized plan with this EXACT structure:
                MIACOMPASS HUB — YOUR RESOURCE PLAN
                [warm opening line]
                [GET HELP NOW if CRITICAL — 211 + most urgent program]
                FEDERAL PROGRAMS [2-3 programs]
                FLORIDA PROGRAMS [2-3 programs]
                MIAMI-DADE PROGRAMS [3-4 programs]
                NEAR YOU — [neighborhood] [if applicable]
                EDUCATION & TRAINING [always 1-2 options]
                
                YOUR NEXT STEPS IN ORDER:
                1. [Today's action]
                2. [This week's action]
                3. [This week's action]
                4. [This month's action]
                
                (If in Spanish, use: SUS PRÓXIMOS PASOS EN ORDEN:)
                
                GETTING THERE [addresses + "use Transit Hub tab"]
                Questions? Ask me — I remember your full profile.
                
                CRITICAL: The "YOUR NEXT STEPS IN ORDER" section MUST be at the end of the plan, just before "GETTING THERE". It MUST use a numbered list (1., 2., 3., 4.).
                
                Rules:
                - Max 700 words.
                - If user preferred Spanish, respond entirely in Spanish.
                - Always include education.
                - Use Markdown for formatting.
                
                Eligibility Results: ${eligibilityResults}
                Intake Summary: ${JSON.stringify(intakeSummary)}
            `
        });
        console.log("Action Plan Agent finished.");
        return response.text;
    } catch (error) {
        console.error("Action Plan Agent failed:", error);
        return "Error generating plan.";
    }
}

// 5. Jobs Agent: Finds Miami-Dade job listings
async function jobsAgent(intakeSummary: any) {
    console.log("Jobs Agent starting...");
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `
                You are the Jobs Agent. Find real current Miami-Dade job listings matching the user profile.
                
                Intake Summary: ${JSON.stringify(intakeSummary)}
                
                Output a JSON array of job objects. Each object MUST have:
                - title: The job title
                - company: The company name
                - location: Neighborhood or city in Miami-Dade
                - link: URL to apply or more info (if available, otherwise null)
                - category: Government, Healthcare, Trades, Tech, Hospitality, Logistics, Education, or Retail
                - datePosted: ISO 8601 date string (e.g., "2026-03-15")
                - description: A brief 2-3 sentence overview of the role
                - requirements: A short list of key qualifications or skills needed
                
                Always include these 3 mandatory entries in the array (use current date for datePosted):
                1. { "title": "Job Training & Placement", "company": "CareerSource South Florida", "location": "Multiple Locations", "link": "https://careersourcesfl.com", "category": "Logistics", "datePosted": "2026-03-21", "description": "Access free job training, career coaching, and placement services across Miami-Dade.", "requirements": "Miami-Dade resident, seeking employment or career advancement." }
                2. { "title": "County Government Careers", "company": "Miami-Dade County", "location": "Miami, FL", "link": "https://miamidade.gov/jobs", "category": "Government", "datePosted": "2026-03-21", "description": "Explore diverse career opportunities within the Miami-Dade County government departments.", "requirements": "Varies by position; typically requires background check and residency." }
                3. { "title": "State Employment", "company": "State of Florida", "location": "Florida", "link": "https://jobs.myflorida.com", "category": "Government", "datePosted": "2026-03-21", "description": "Find state-level employment opportunities in various sectors across Florida.", "requirements": "Varies by position; must meet state eligibility requirements." }
                
                Find 5-7 additional REAL jobs.
            `,
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: "application/json"
            }
        });
        const text = response.text || "[]";
        console.log("Jobs Agent response:", text);
        return text;
    } catch (error) {
        console.error("Jobs Agent failed:", error);
        return "[]";
    }
}

// Root Agent: Orchestrator
export async function runMIACompassAgent(type: 'survey' | 'chat' | 'jobs', data: any, chatHistory: any[] = []) {
    const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        history: chatHistory,
        config: {
            systemInstruction: "You are MIACompa, the MIACompass Hub assistant. You help Miami-Dade residents find resources. You remember their profile and previous questions."
        }
    });

    if (type === 'survey') {
        const intake = await intakeAgent(data);
        const research = await researchAgent(intake);
        const eligibility = await eligibilityAgent(research || "", intake);
        const plan = await actionPlanAgent(eligibility || "", intake);
        return plan;
    } else if (type === 'jobs') {
        const intake = await intakeAgent(data);
        return await jobsAgent(intake);
    } else {
        // Chat follow-up
        const response = await chat.sendMessage({ message: data.message });
        return response.text;
    }
}
