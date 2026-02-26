// BE/Controllers/Chatbot.js
const { GoogleGenAI } = require('@google/genai');
const pg = require('pg');

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Use your existing database pool connection here
const pool = new pg.Pool({ /* your existing local DB config */ });

const handleChatbotRequest = async (req, res) => {
    try {
        const userMessage = req.body.message;

        // 1. Fetch all doctors from your database
        const dbResult = await pool.query(`
            SELECT u.user_first_name, u.user_last_name, d.doctor_specialization 
            FROM users u
            JOIN doctor d ON u.user_id = d.doctor_user_id_reference
            WHERE u.user_role = 'Doctor'
        `);
        const doctorsList = dbResult.rows;

        // 2. Format the doctor data into a readable string for the AI
        const availableDoctorsText = doctorsList.map(doc => 
            `Dr. ${doc.user_first_name} ${doc.user_last_name} (Specialty: ${doc.doctor_specialization})`
        ).join(', ');

        // 3. Craft the System Prompt
        const systemInstruction = `
            You are a helpful, empathetic medical assistant for TeleMedPilot. 
            A patient will describe their symptoms, disease, or mood. 
            Your job is to recommend the best doctor for them from this EXACT list of currently available doctors: 
            [${availableDoctorsText}]
            
            Rules:
            - If they feel sad, anxious, or stressed, recommend a Psychiatrist or Therapist.
            - If they have heart issues, recommend a Cardiologist.
            - If they have skin issues, recommend a Dermatologist.
            - ONLY recommend doctors from the provided list. 
            - Tell them why you are recommending that specific doctor.
            - Advise them that this is not an official medical diagnosis.
        `;

        // 4. Call the AI Model
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userMessage,
            config: {
                systemInstruction: systemInstruction,
            }
        });

        // 5. Send response back to frontend
        res.json({ reply: response.text });

    } catch (error) {
        console.error("Chatbot Error:", error);
        res.status(500).json({ error: "Failed to process chat" });
    }
};

module.exports = { handleChatbotRequest };