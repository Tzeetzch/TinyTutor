namespace TinyTutor;

/// <summary>
/// Whether the Star Shop overlay is open. Lives in a singleton so the shop can be
/// opened as a modal from anywhere (e.g. the quiz) without navigating away — which
/// would tear down the page and lose the child's streak.
/// </summary>
public class ShopState
{
    public bool IsOpen { get; private set; }
    public event Action? OnChange;

    public void Open()
    {
        if (IsOpen) return;
        IsOpen = true;
        OnChange?.Invoke();
    }

    public void Close()
    {
        if (!IsOpen) return;
        IsOpen = false;
        OnChange?.Invoke();
    }
}
