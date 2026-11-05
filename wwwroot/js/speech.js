// iOS requires speechSynthesis.speak() to be called in a user gesture context.
// A silent speak() on the first pointerdown unlocks the speech engine
// so subsequent calls (which go through the WASM async dispatch) are allowed.
document.addEventListener('pointerdown', function () {
    const silent = new SpeechSynthesisUtterance(' ');
    silent.volume = 0;
    window.speechSynthesis.speak(silent);
}, { once: true });

// ── Voice choice ────────────────────────────────────────────
// Browsers pick a default voice for a language on their own, and on Linux
// that is usually eSpeak (robotic). So we choose: the voice saved in the
// settings if there is one, otherwise the best-sounding voice we can find.

const VOICE_KEY = 'tt-voice-';           // + 'nl' / 'en'
let voiceCache = [];

function loadVoices() {
    try { voiceCache = window.speechSynthesis.getVoices() || []; } catch (e) { voiceCache = []; }
    return voiceCache;
}
loadVoices();
if ('onvoiceschanged' in window.speechSynthesis) {
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
}

const isDesktopLinux = /Linux/.test(navigator.userAgent) && !/Android/.test(navigator.userAgent);

function langPrefix(lang) { return (lang || 'nl-NL').slice(0, 2).toLowerCase(); }

// Higher is nicer. Network/neural voices sound far better than eSpeak.
function voiceScore(v, lang) {
    const name = (v.name || '').toLowerCase();
    let s = 0;
    if (/natural|neural|online|premium|enhanced|siri/.test(name)) s += 60;
    if (name.includes('google')) s += 50;
    if (name.includes('microsoft')) s += 20;
    if (/espeak|mbrola|festival|pico|\+/.test(name)) s -= 60;   // "Dutch+klatt" is an eSpeak variant
    if (isDesktopLinux && v.localService) s -= 40;               // Linux system voices are almost always eSpeak
    if ((v.lang || '').toLowerCase().replace('_', '-') === (lang || '').toLowerCase()) s += 5;   // nl-NL over nl-BE
    if (v.default) s += 1;
    return s;
}

function voicesFor(lang) {
    const pre = langPrefix(lang);
    const list = (voiceCache.length ? voiceCache : loadVoices())
        .filter(v => (v.lang || '').toLowerCase().startsWith(pre));
    return list.sort((a, b) => voiceScore(b, lang) - voiceScore(a, lang));
}

function savedVoiceId(lang) {
    try { return localStorage.getItem(VOICE_KEY + langPrefix(lang)) || ''; } catch (e) { return ''; }
}

function pickVoice(lang, forceId) {
    const list = voicesFor(lang);
    const id = forceId !== undefined ? forceId : savedVoiceId(lang);
    if (id) {
        const chosen = list.find(v => v.voiceURI === id);
        if (chosen) return chosen;
    }
    return list[0] || null;
}

function makeUtterance(text, lang, rate, voiceId) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang || 'nl-NL';
    utterance.rate = rate || 0.85;
    utterance.pitch = 1.1;
    const voice = pickVoice(utterance.lang, voiceId);
    if (voice) { try { utterance.voice = voice; } catch (e) { } }
    return utterance;
}

// For the settings panel: the voices for a language, best first.
// Voices load asynchronously, so wait briefly for them if the list is empty.
window.getVoiceList = function (lang) {
    return new Promise(function (resolve) {
        const done = function () {
            resolve(voicesFor(lang).map(v => ({
                id: v.voiceURI,
                name: v.name,
                lang: v.lang,
                local: !!v.localService,
            })));
        };
        if (loadVoices().length) { done(); return; }
        let finished = false;
        const finish = function () { if (!finished) { finished = true; loadVoices(); done(); } };
        window.speechSynthesis.addEventListener('voiceschanged', finish, { once: true });
        setTimeout(finish, 1500);
    });
};

window.getVoiceChoice = function (lang) { return savedVoiceId(lang); };

window.setVoiceChoice = function (lang, id) {
    try {
        if (id) localStorage.setItem(VOICE_KEY + langPrefix(lang), id);
        else localStorage.removeItem(VOICE_KEY + langPrefix(lang));
    } catch (e) { }
};

// Try a voice from the settings without saving it ('' = automatic choice).
window.previewVoice = function (lang, id, text) {
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(makeUtterance(text, lang, 0.85, id || ''));
};

// ── Speaking ────────────────────────────────────────────────

window.speakNumber = function (text, lang, rate) {
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(makeUtterance(text, lang, rate));
};

// Speak and resolve only once the utterance has finished (onend).
// Used by the multiply counter so each number is fully spoken before the next.
// A length-based safety timeout guards against engines that never fire onend.
window.speakAndWait = function (text, lang, rate) {
    return new Promise(function (resolve) {
        try {
            window.speechSynthesis.cancel();
            const utterance = makeUtterance(text, lang, rate);

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
