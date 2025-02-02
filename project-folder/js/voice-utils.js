let utterance = null;

function convertToVoice(text) {
    utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
}

function pauseVoice() {
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
    }
}

function resumeVoice() {
    if (speechSynthesis.paused) {
        speechSynthesis.resume();
    }
}

function stopVoice() {
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
}
