namespace TinyTutor;

/// <summary>All user-visible UI text. One place to update translations.</summary>
public static class Strings
{
    private static string T(string lang, string en, string nl) => lang == "nl" ? nl : en;

    // ── Navigation ────────────────────────────────────────
    public static string NavHome(string lang)       => T(lang, "Home",         "Home");
    public static string NavChart(string lang)      => T(lang, "Number Chart", "Getallenkaart");
    public static string NavFlashCards(string lang) => T(lang, "Flash Cards",  "Flitskaarten");
    public static string NavQuiz(string lang)       => T(lang, "Number Quiz",  "Getallenquiz");

    // ── Home page ─────────────────────────────────────────
    public static string HomeWelcome(string lang)   => T(lang, "Welcome to TinyTutor!",                      "Welkom bij TinyTutor!");
    public static string HomeSubtitle(string lang)  => T(lang, "Pick an activity to practise numbers 1–30",  "Kies een activiteit om getallen 1–30 te oefenen");
    public static string HomeChartDesc(string lang) => T(lang, "See and hear all numbers 1–30",              "Zie en hoor alle getallen 1–30");
    public static string HomeCardsDesc(string lang) => T(lang, "Practise one number at a time",              "Oefen één getal tegelijk");
    public static string HomeQuizDesc(string lang)  => T(lang, "Match the number to its name!",              "Koppel het getal aan de naam!");

    // ── Number Chart ──────────────────────────────────────
    public static string ChartTitle(string lang)    => T(lang, "Number Chart",               "Getallenkaart");
    public static string ChartSubtitle(string lang) => T(lang, "Click any number to hear it!", "Klik op een getal om het te horen!");

    // ── Flash Cards ───────────────────────────────────────
    public static string CardsTitle(string lang)    => T(lang, "Flash Cards",    "Flitskaarten");
    public static string CardsSubtitle(string lang) => T(lang, "Say the number out loud, then click Hear It! to check.",
                                                              "Zeg het getal hardop en klik dan op Hoor het! om te controleren.");
    public static string CardsHearIt(string lang)   => T(lang, "🔊 Hear It!",    "🔊 Hoor het!");
    public static string CardsNext(string lang)     => T(lang, "Next ➡️",        "Volgende ➡️");
    public static string CardsStreak(string lang)   => T(lang, "🔥 Streak:",     "🔥 Reeks:");

    // ── Number Quiz — mode tabs ───────────────────────────
    public static string QuizTitle(string lang)       => T(lang, "Number Quiz",  "Getallenquiz");
    public static string QuizModeWord(string lang)    => T(lang, "📖 Word",      "📖 Woord");
    public static string QuizModeBefore(string lang)  => T(lang, "⬅️ Before",   "⬅️ Ervoor");
    public static string QuizModeAfter(string lang)   => T(lang, "➡️ After",    "➡️ Erna");
    public static string QuizModeBetween(string lang) => T(lang, "↔️ Between",  "↔️ Ertussen");
    public static string QuizModeCount(string lang)   => T(lang, "🔵 Count",    "🔵 Tellen");

    // ── Number Quiz — question text ───────────────────────
    public static string QuizBefore(string lang, int n)         => T(lang, $"What comes before {n}?",          $"Wat komt voor {n}?");
    public static string QuizAfter(string lang, int n)          => T(lang, $"What comes after {n}?",           $"Wat komt na {n}?");
    public static string QuizBetween(string lang, int a, int b) => T(lang, $"What is between {a} and {b}?",   $"Wat zit er tussen {a} en {b}?");
    public static string QuizCountDots(string lang)             => T(lang, "How many dots do you see?",        "Hoeveel stippen zie je?");

    // ── Number Quiz — feedback & buttons ─────────────────
    public static string QuizCorrect(string lang)   => T(lang, "🎉 Correct!",      "🎉 Goed zo!");
    public static string QuizNext(string lang)      => T(lang, "Next ➡️",          "Volgende ➡️");
    public static string QuizScore(string lang)     => T(lang, "Score",            "Score");

    // ── Quiz — auto-advance ───────────────────────────────
    public static string QuizAutoNext(string lang)  => T(lang, "Auto-next:", "Auto-verder:");
    public static string QuizDelayOff(string lang)  => T(lang, "Off",        "Uit");

    // ── Spoken feedback (sent to TTS) ─────────────────────
    private static readonly Random _rng = new();
    private static T Pick<T>(T[] arr) => arr[_rng.Next(arr.Length)];

    // First try — no notable streak yet
    private static readonly string[] CorrectFirstTryNl =
    [
        "Jippie! In een keer!", "Wauw! Meteen goed!", "Yes! Superslim!",
        "Geweldig! In een keer raak!", "Fantastisch! Meteen raak!",
        "Briljant! In een keer goed!", "Knap hoor! Meteen goed!",
        "Toppie! Meteen raak!", "Woehoe! Meteen goed!", "Super! In een keer!",
        "Jij bent geweldig!", "Raak! In een keer!", "Wat een kanjer!",
    ];
    private static readonly string[] CorrectFirstTryEn =
    [
        "Yippee! First try!", "Wow! Got it straight away!", "Yes! Super smart!",
        "Amazing! First time!", "Fantastic! First try!", "Brilliant! Right away!",
        "Woohoo! First try!", "Awesome! Got it immediately!", "You're amazing! First try!",
        "Super! First time!", "Nailed it! First try!", "Yes! Right away!",
        "What a star!",
    ];

    // First try — streak 3–4
    private static readonly string[] CorrectStreakMidNl =
    [
        "Drie op rij! Fantastisch!", "Je bent op dreef! Geweldig!",
        "Raak raak raak! Super!", "Jij gaat niet te stoppen!",
        "Drie op rij! Jij bent een ster!", "Wauw, je vliegt erdoorheen!",
    ];
    private static readonly string[] CorrectStreakMidEn =
    [
        "Three in a row! Fantastic!", "You're on a roll! Great!",
        "Hit hit hit! Super!", "You're unstoppable!",
        "Three in a row! You're a star!", "Wow, you're flying through these!",
    ];

    // First try — streak 5+
    private static readonly string[] CorrectStreakHighNl =
    [
        "Vijf op rij! Ongelooflijk!", "Wat een reeks! Jij bent een held!",
        "Ongestoppbaar! Fantastisch!", "Jij bent een rekenster!",
        "Wauw, wat een reeks! Geweldig!", "Recordhouder! Prachtig!",
        "Jij bent een getallenkampioen!", "Niemand kan jou stoppen!",
    ];
    private static readonly string[] CorrectStreakHighEn =
    [
        "Five in a row! Incredible!", "What a streak! You're a hero!",
        "Unstoppable! Fantastic!", "You're a number star!",
        "Wow, what a streak! Amazing!", "Record breaker! Wonderful!",
        "You're a number champion!", "Nobody can stop you!",
    ];

    // Correct after one wrong attempt
    private static readonly string[] CorrectOneWrongNl =
    [
        "Goed zo! Je hebt het!", "Ja! Je deed het!",
        "Zie je wel, je kan het!", "Prima! Volhouden loont!",
        "Ja! Je hebt het gehaald!", "Super! Je hebt niet opgegeven!",
        "Geweldig! Toch goed!", "Ja! Doorzetten werkt!",
        "Goed gedaan! Je wist het toch!", "Bijna meteen goed, slim!",
    ];
    private static readonly string[] CorrectOneWrongEn =
    [
        "Good job! You got it!", "Yes! You did it!",
        "See, you can do it!", "Great! Sticking with it worked!",
        "Yes! You got there!", "Super! You didn't give up!",
        "Great! Got it!", "Yes! Persistence paid off!",
        "Well done! You knew it!", "Almost first try, clever!",
    ];

    // Correct after multiple wrong attempts
    private static readonly string[] CorrectMultiWrongNl =
    [
        "Yes! Nooit opgeven!", "Geweldig! Je hebt doorgezet!",
        "Hoeray! Je hebt het toch!", "Sterk! Je bent niet gestopt!",
        "Wauw! Volhouden werkt!", "Super! Je hebt het gehaald!",
        "Jippie! Doorzetten loont!", "Fantastisch! Toch goed!",
        "Goed gedaan! Je hebt gewonnen!", "Jij geeft nooit op! Geweldig!",
    ];
    private static readonly string[] CorrectMultiWrongEn =
    [
        "Yes! Never give up!", "Amazing! You kept going!",
        "Hooray! You got it!", "Strong effort! You made it!",
        "Wow! Persistence pays off!", "Super! You got there!",
        "Yippee! Sticking with it works!", "Fantastic! You got it!",
        "Well done! You won!", "You never give up! Amazing!",
    ];

    // Wrong attempt — always encouraging
    private static readonly string[] WrongNl =
    [
        "Probeer nog eens!", "Bijna! Probeer opnieuw!",
        "Oeps! Nog een keer!", "Niet erg, probeer nog eens!",
        "Ga door! Je kan het!", "Bijna goed! Nog een keer!",
        "Kijk nog eens goed!", "Bijna! Welk getal is het?",
        "Niet opgeven! Nog een keer!", "Hmm, probeer het nog eens!",
        "Je weet het! Probeer opnieuw!", "Bijna raak! Nog een poging!",
    ];
    private static readonly string[] WrongEn =
    [
        "Try again!", "Almost! Try once more!",
        "Oops! One more try!", "No worries, try again!",
        "Keep going! You can do it!", "Almost right! Once more!",
        "Look carefully!", "Almost! Which number is it?",
        "Don't give up! Try again!", "Hmm, try again!",
        "You know it! Try once more!", "So close! One more go!",
    ];

    public static string SpeakCorrectFeedback(string lang, int wrongCount, int streak)
    {
        string phrase = lang == "nl"
            ? (wrongCount == 0
                ? (streak >= 5 ? Pick(CorrectStreakHighNl) :
                   streak >= 3 ? Pick(CorrectStreakMidNl)  : Pick(CorrectFirstTryNl))
                : (wrongCount == 1 ? Pick(CorrectOneWrongNl) : Pick(CorrectMultiWrongNl)))
            : (wrongCount == 0
                ? (streak >= 5 ? Pick(CorrectStreakHighEn) :
                   streak >= 3 ? Pick(CorrectStreakMidEn)  : Pick(CorrectFirstTryEn))
                : (wrongCount == 1 ? Pick(CorrectOneWrongEn) : Pick(CorrectMultiWrongEn)));
        return phrase + " ";
    }

    public static string SpeakWrongFeedback(string lang)
        => lang == "nl" ? Pick(WrongNl) : Pick(WrongEn);
}
