namespace TinyTutor;

/// <summary>
/// A time on a 12-hour analog clock (Hour 1–12, Minute 0–59), plus how to say it.
/// Dutch reads the half hour against the *next* hour: 2:30 is "half drie".
/// </summary>
public readonly record struct ClockTime(int Hour, int Minute)
{
    public int NextHour => Hour % 12 + 1;
    public int PrevHour => Hour == 1 ? 12 : Hour - 1;

    /// <summary>"2:30"</summary>
    public string Digital => $"{Hour}:{Minute:00}";

    /// <summary>
    /// The time as a child would hear it: "half 3" / "half past 2".
    /// Display keeps the hours as digits (easy to find on the clock face);
    /// speech spells every number out so the TTS engine reads it naturally.
    /// </summary>
    public string Phrase(string lang, bool speech = false)
    {
        string N(int n) => speech ? NumberHelper.GetSpeechWord(n, lang) : n.ToString();
        int h = Hour, next = NextHour, m = Minute;

        if (lang == "nl")
        {
            return m switch
            {
                0  => $"{N(h)} uur",
                15 => $"kwart over {N(h)}",
                30 => $"half {N(next)}",
                45 => $"kwart voor {N(next)}",
                < 15 => $"{NumberHelper.GetWord(m, "nl")} over {N(h)}",           // 5, 10 over
                < 30 => $"{NumberHelper.GetWord(30 - m, "nl")} voor half {N(next)}", // 10, 5 voor half
                < 45 => $"{NumberHelper.GetWord(m - 30, "nl")} over half {N(next)}", // 5, 10 over half
                _    => $"{NumberHelper.GetWord(60 - m, "nl")} voor {N(next)}",      // 10, 5 voor
            };
        }

        return m switch
        {
            0  => $"{N(h)} o'clock",
            15 => $"quarter past {N(h)}",
            30 => $"half past {N(h)}",
            45 => $"quarter to {N(next)}",
            < 30 => $"{NumberHelper.GetWord(m, "en")} past {N(h)}",
            _    => $"{NumberHelper.GetWord(60 - m, "en")} to {N(next)}",
        };
    }
}
