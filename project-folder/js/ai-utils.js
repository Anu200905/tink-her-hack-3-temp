async function generateQuestionsWithGemini(pdfText) {
    const apiKey = 'AIzaSyAAkcO40oFgypWTkbjo_OPBfsQTeW2sJTY'; // Replace with your API key
    const apiUrl = 'https://api.google.com/v1/gemini/predict'; // Replace with the actual Gemini API endpoint

    const requestPayload = {
        "input": pdfText
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestPayload)
        });

        if (response.ok) {
            const data = await response.json();
            if (data && data.generated_questions) {
                return data.generated_questions;
            } else {
                throw new Error('Failed to extract questions from Gemini.');
            }
        } else {
            throw new Error('Failed to fetch from Gemini API: ' + response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
        return 'Error generating questions from Gemini AI.';
    }
}
