// iOS requires speechSynthesis.speak() to be called in a user gesture context.
// A silent speak() on the first pointerdown unlocks the speech engine
// so subsequent calls (which go through the WASM async dispatch) are allowed.
document.addEventListener('pointerdown', function () {
    const silent = new SpeechSynthesisUtterance(' ');
    silent.volume = 0;
    window.speechSynthesis.speak(silent);
}, { once: true });

window.speakNumber = function (text, lang, rate) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang || 'nl-NL';
    utterance.rate = rate || 0.85;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
};

// Speak and resolve only once the utterance has finished (onend).
// Used by the multiply counter so each number is fully spoken before the next.
// A length-based safety timeout guards against engines that never fire onend.
window.speakAndWait = function (text, lang, rate) {
    return new Promise(function (resolve) {
        try {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang || 'nl-NL';
            utterance.rate = rate || 0.85;
            utterance.pitch = 1.1;

            let settled = false;
            const finish = function () {
                if (settled) return;
                settled = true;
                clearTimeout(timer);
                resolve();
            };
            utterance.onend = finish;
            utterance.onerror = finish;

            // Fallback: roughly how long the word could take at this rate, + headroom.
            const timer = setTimeout(finish, 900 + text.length * 140 / (rate || 0.85));
            window.speechSynthesis.speak(utterance);
        } catch (e) {
            resolve();
        }
    });
};
