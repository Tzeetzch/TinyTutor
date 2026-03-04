// iOS requires speechSynthesis.speak() to be called in a user gesture context.
// A silent speak() on the first pointerdown unlocks the speech engine
// so subsequent calls (which go through the WASM async dispatch) are allowed.
document.addEventListener('pointerdown', function () {
    const silent = new SpeechSynthesisUtterance(' ');
    silent.volume = 0;
    window.speechSynthesis.speak(silent);
}, { once: true });

window.speakNumber = function (text, lang) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang || 'nl-NL';
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
};
