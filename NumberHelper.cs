namespace TinyTutor;

public static class NumberHelper
{
    private static readonly string[] EnglishWords =
    [
        "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
        "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen",
        "eighteen", "nineteen", "twenty", "twenty-one", "twenty-two", "twenty-three",
        "twenty-four", "twenty-five", "twenty-six", "twenty-seven", "twenty-eight",
        "twenty-nine", "thirty"
    ];

    private static readonly string[] DutchWords =
    [
        "", "één", "twee", "drie", "vier", "vijf", "zes", "zeven", "acht", "negen", "tien",
        "elf", "twaalf", "dertien", "veertien", "vijftien", "zestien", "zeventien",
        "achttien", "negentien", "twintig", "eenentwintig", "tweeëntwintig", "drieëntwintig",
        "vierentwintig", "vijfentwintig", "zesentwintig", "zevenentwintig", "achtentwintig",
        "negenentwintig", "dertig"
    ];

    // TTS-friendly Dutch: ë trips up speech engines, spell out the syllable break instead
    private static readonly string[] DutchSpeechWords =
    [
        "", "één", "twee", "drie", "vier", "vijf", "zes", "zeven", "acht", "negen", "tien",
        "elf", "twaalf", "dertien", "veertien", "vijftien", "zestien", "zeventien",
        "achttien", "negentien", "twintig", "eenentwintig", "twee en twintig", "drie en twintig",
        "vierentwintig", "vijfentwintig", "zesentwintig", "zevenentwintig", "achtentwintig",
        "negenentwintig", "dertig"
    ];

    public static string GetWord(int number, string lang = "en") =>
        lang == "nl" ? DutchWords[number] : EnglishWords[number];

    public static string GetSpeechWord(int number, string lang = "en") =>
        lang == "nl" ? DutchSpeechWords[number] : EnglishWords[number];

    public static string GetDisplayWord(int number, string lang = "en")
    {
        var word = GetWord(number, lang);
        return char.ToUpper(word[0]) + word[1..];
    }
}
