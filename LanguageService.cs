namespace TinyTutor;

public class LanguageService
{
    public string Current { get; private set; } = "nl";
    public event Action? OnChange;

    public void Set(string lang)
    {
        if (Current == lang) return;
        Current = lang;
        OnChange?.Invoke();
    }

    public bool IsEnglish => Current == "en";
    public string LangCode => Current == "en" ? "en-US" : "nl-NL";
}
