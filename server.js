const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(express.json());

// Route for the API
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const chatCompletion = await getGroqChatCompletion(message);
        const content = chatCompletion.choices[0]?.message?.content || 'No response from Groq';
        res.json({ content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching chat completion' });
    }
});

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

async function getGroqChatCompletion(msg) {
    return groq.chat.completions.create({
        messages: [
            {
                role: 'user',
                content: msg,
            },
        ],
        model: 'llama3-8b-8192',
    });
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
