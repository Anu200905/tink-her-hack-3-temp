async function extractPDFText(pdfData) {
    const pdf = await pdfjsLib.getDocument(pdfData).promise;
    let text = "";
    for (let i = 0; i < pdf.numPages; i++) {
        const page = await pdf.getPage(i + 1);
        const pageText = await page.getTextContent();
        text += pageText.items.map(item => item.str).join(' ') + " ";
    }
    return text;
}
