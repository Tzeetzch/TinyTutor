// Blazor Server calls JS via SignalR, not directly in a user gesture.
// A silent speak() on the first pointerdown unlocks the speech engine
// so subsequent InvokeVoidAsync calls are allowed by the browser.
document.addEventListener('pointerdown', function () {
    const silent = new SpeechSynthesisUtterance('');
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
