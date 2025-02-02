const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const bodyParser = require('body-parser');

// Initialize the app
const app = express();
const port = 3000;

// Set up middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// File upload setup using multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Create an uploads folder if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Endpoint to upload PDF file
app.post('/upload', upload.single('pdfFile'), (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.file.filename);
    fs.readFile(filePath, async (err, data) => {
        if (err) {
            return res.status(500).send('Error reading the file');
        }
        try {
            // Extract text from the PDF using pdf-parse
            const pdfText = await pdf(data);
            const text = pdfText.text;

            // Send text to the Gemini API for question generation
            const questions = await generateQuestionsWithGemini(text);
            res.json({ questions });
        } catch (error) {
            res.status(500).send('Error processing the PDF file');
        } finally {
            // Delete the uploaded file after processing
            fs.unlinkSync(filePath);
        }
    });
});

// Function to generate questions using Gemini API
async function generateQuestionsWithGemini(pdfText) {
    const apiKey = 'YOUR_API_KEY'; // Replace with your Gemini API key
    const apiUrl = 'https://api.google.com/v1/gemini/predict'; // Replace with the actual Gemini API endpoint

    const requestPayload = {
        input: pdfText
    };

    try {
        const response = await axios.post(apiUrl, requestPayload, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.data && response.data.generated_questions) {
            return response.data.generated_questions;
        } else {
            throw new Error('No questions generated');
        }
    } catch (error) {
        console.error('Error generating questions from Gemini:', error);
        throw error;
    }
}

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
