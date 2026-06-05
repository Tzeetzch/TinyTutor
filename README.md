# TinyTutor 🔢

A playful, kid-friendly web app for learning the numbers **1–50** — by sight, by sound, and by play — plus first sums and number bonds. Built with **Blazor WebAssembly** (.NET 8), it runs entirely in the browser, works offline as an installable PWA, and speaks every number out loud in **English or Dutch**.

## Features

- **🔢 Number Chart** — a colorful grid of 1–50. Tap any number to hear it spoken aloud.
- **🃏 Flash Cards** — a number flips to reveal its written word; tap *Hear it* to listen. Keeps a streak going for every card heard before flipping.
- **⭐ Number Quiz** — multiple-choice practice with eight question modes:
  - **Word** — match the spoken/written word to the number
  - **Before** — what comes before a number
  - **After** — what comes after a number
  - **Between** — what fits between two numbers
  - **Count** — count the dots
  - **Add** — addition within 20, shown with two groups of dots
  - **Subtract** — subtraction within 20, shown as dots taken away
  - **Make 10** — number bonds: how many more make ten
  
  Modes can be toggled on/off, with optional auto-advance (off / 2s / 3s / 5s), live scoring, and a 🔥 streak counter.
- **🛒 Star Shop** — correct quiz answers earn ⭐ stars, scaled by the first-try streak (1 → 2 → 3 → 4 stars as the streak climbs through 5/10/20). The shop opens as a **modal from the star badge**, so kids can spend without leaving the quiz and losing their streak. Three tiers to save up for:
  - **Quick wins** — a single friend (🦖 dino, 🐱 cat, 🚀 rocket…) walks, floats, or flies across the screen.
  - **Premium spectacles** — layered CSS animations: 🎉 confetti, 🎆 fireworks, 🚀 a rocket launch to the moon, 🐉 a fire-breathing dragon, 🌈 a drawn rainbow with a galloping unicorn, a 🐾 animal parade.
  - **Deluxe light shows** — a real `<canvas>` particle engine (gravity, drag, fading light trails, hundreds of particles at 60fps): 🎊 confetti storm, 🌈 rainbow fountain, 🌠 meteor shower, 🔥 fire tornado, 🌌 galaxy, 🎆 mega fireworks.
  
  The balance is saved on the device, and each not-yet-affordable reward shows a fill that "charges up" as the balance approaches its price — so kids can see how close the next show is.
- **🔊 Spoken feedback** — every number, question, and answer is read aloud using the browser's Web Speech API, with TTS-tuned Dutch pronunciations.
- **🌍 Bilingual** — full English and Dutch (default) UI and speech, switchable on the fly.
- **🎨 Themeable** — eight preset accent colors plus a custom color picker. Your choice and language are saved in `localStorage`.
- **📱 PWA & mobile-first** — installable to the home screen, works offline via a service worker, with a dedicated mobile navigation layout.

## Tech stack

| | |
|---|---|
| Framework | Blazor WebAssembly, .NET 8 |
| Hosting | Static files (no server backend) — served by **nginx** in Docker |
| Speech | Web Speech API (`SpeechSynthesis`) via JS interop |
| Persistence | Browser `localStorage` |
| PWA | Web manifest + service worker |

The app has no backend and no external dependencies at runtime — all logic (number words, quiz generation, scoring) runs client-side in WebAssembly.

## Getting started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)

### Run locally

```bash
dotnet run
```

Then open the URL shown in the console (typically `https://localhost:5xxx`).

### Build for release

```bash
dotnet publish -c Release -o ./publish
```

The static site is emitted to `./publish/wwwroot`.

## Docker

A multi-stage `Dockerfile` builds the WASM app and serves the static output with nginx.

```bash
docker compose up --build
```

By default the app is published on host port **5012** (`http://localhost:5012`). Edit the port mapping in [`compose.yaml`](compose.yaml) to change it.

## Project structure

```
Components/
  Layout/      MainLayout, NavMenu
  Pages/       Home, NumberChart, FlashCards, NumberQuiz
  Shared/      ActivityCard, MobileNav, PageHeader, SettingsPanel, ShopModal, StarBadge, TtButton
wwwroot/
  js/speech.js     Web Speech API interop
  js/effects.js    Canvas particle engine for the deluxe shop shows
  index.html       Theme pre-load + PWA bootstrap
  service-worker.js
  manifest.json
NumberHelper.cs    Number → word/speech-word lookups (EN/NL)
LanguageService.cs Current-language state + change notifications
StarService.cs     Star balance — earned in the quiz, spent in the shop, saved to localStorage
ShopState.cs       Whether the shop modal is open (so it can open from anywhere)
Strings.cs         All UI/speech strings (EN/NL)
```

## License

This project does not currently specify a license.
