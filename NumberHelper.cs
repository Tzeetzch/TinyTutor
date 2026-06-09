namespace TinyTutor;

public static class NumberHelper
{
    /// <summary>Highest number practised across the chart, flash cards and quiz.</summary>
    public const int Max = 50;

    // ── Building blocks ────────────────────────────────────
    private static readonly string[] EnOnes =
        ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    private static readonly string[] EnTeens =
        ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
         "sixteen", "seventeen", "eighteen", "nineteen"];
    private static readonly string[] EnTens =
        ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

    private static readonly string[] NlOnes =
        ["", "één", "twee", "drie", "vier", "vijf", "zes", "zeven", "acht", "negen"];
    private static readonly string[] NlTeens =
        ["tien", "elf", "twaalf", "dertien", "veertien", "vijftien",
         "zestien", "zeventien", "achttien", "negentien"];
    private static readonly string[] NlTens =
        ["", "", "twintig", "dertig", "veertig", "vijftig", "zestig", "zeventig", "tachtig", "negentig"];

    // Pre-built so callers stay allocation-free.
    private static readonly string[] EnglishWords    = Build(n => EnglishWord(n));
    private static readonly string[] DutchWords       = Build(n => DutchWord(n, speech: false));
    private static readonly string[] DutchSpeechWords = Build(n => DutchWord(n, speech: true));

    private static string[] Build(Func<int, string> word)
    {
        var arr = new string[100];
        for (int n = 0; n < arr.Length; n++) arr[n] = word(n);
        return arr;
    }

    // ── Generators ─────────────────────────────────────────
    private static string EnglishWord(int n)
    {
        if (n < 0) return "";
        if (n == 0) return "zero";
        if (n < 10) return EnOnes[n];
        if (n < 20) return EnTeens[n - 10];
        int t = n / 10, u = n % 10;
        return u == 0 ? EnTens[t] : $"{EnTens[t]}-{EnOnes[u]}";
    }

    private static string DutchWord(int n, bool speech)
    {
        if (n < 0) return "";
        if (n == 0) return "nul";
        if (n < 10) return NlOnes[n];
        if (n < 20) return NlTeens[n - 10];
        int t = n / 10, u = n % 10;
        if (u == 0) return NlTens[t];

        // "two" and "three" glue onto "en" with a trema (tweeën-, drieën-) which
        // speech engines mangle — spell the syllable break out instead.
        if (speech && (u == 2 || u == 3))
            return $"{NlOnes[u]} en {NlTens[t]}";

        return UnitEn(u) + NlTens[t];
    }

    // Unit + connecting "en", e.g. 21 → "eenen" + "twintig" = "eenentwintig".
    private static string UnitEn(int u) => u switch
    {
        1 => "eenen",
        2 => "tweeën",
        3 => "drieën",
        _ => NlOnes[u] + "en"
    };

    // ── Public API ─────────────────────────────────────────
    public static string GetWord(int number, string lang = "en") =>
        lang == "nl" ? DutchWords[number] : EnglishWords[number];

    public static string GetSpeechWord(int number, string lang = "en") =>
        lang == "nl" ? DutchSpeechWords[number] : EnglishWords[number];

    public static string GetDisplayWord(int number, string lang = "en")
    {
        var word = GetWord(number, lang);
        return word.Length == 0 ? word : char.ToUpper(word[0]) + word[1..];
    }
}
