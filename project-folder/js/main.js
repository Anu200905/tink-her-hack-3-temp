document.getElementById('pdf-file').addEventListener('change', handleFileSelect);

async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = async function(e) {
            const pdfData = new Uint8Array(e.target.result);
            const pdfText = await extractPDFText(pdfData);
            document.getElementById('pdf-text').value = pdfText;

            // Hide the loading spinner after PDF is processed
            document.getElementById('loading').style.display = 'none';
        };

        // Show loading spinner while processing PDF
        document.getElementById('loading').style.display = 'block';
        reader.readAsArrayBuffer(file);
    } else {
        alert('Please upload a valid PDF file.');
    }
}

document.getElementById('convert-to-voice').addEventListener('click', function() {
    const text = document.getElementById('pdf-text').value;
    if (text) {
        convertToVoice(text);
    } else {
        alert('No PDF text loaded.');
    }
});

document.getElementById('pause-voice').addEventListener('click', pauseVoice);
document.getElementById('resume-voice').addEventListener('click', resumeVoice);
document.getElementById('stop-voice').addEventListener('click', stopVoice);

document.getElementById('generate-notes').addEventListener('click', function() {
    const text = document.getElementById('pdf-text').value;
    if (text) {
        const notes = generateShortNotes(text);
        document.getElementById('short-notes').value = notes;
    } else {
        alert('No PDF text loaded.');
    }
});

document.getElementById('extract-questions').addEventListener('click', async function() {
    const pdfText = document.getElementById('pdf-text').value;
    if (pdfText) {
        try {
            const questions = await generateQuestionsWithGemini(pdfText);
            document.getElementById('questions-output').value = questions;
        } catch (error) {
            alert('Error: ' + error.message);
        }
    } else {
        alert('Please load a PDF first!');
    }
});
