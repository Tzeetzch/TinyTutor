using Microsoft.JSInterop;

namespace TinyTutor;

/// <summary>
/// The child's star balance — earned in the quiz, spent in the shop.
/// Persisted to localStorage. Safe as a singleton in WebAssembly (single-threaded).
/// </summary>
public class StarService
{
    private readonly IJSRuntime _js;
    public StarService(IJSRuntime js) => _js = js;

    public int Count { get; private set; }
    public bool Loaded { get; private set; }
    public event Action? OnChange;

    /// <summary>Load the saved balance once (call after first render).</summary>
    public async Task EnsureLoadedAsync()
    {
        if (Loaded) return;
        Count = await _js.InvokeAsync<int>("getStars");
        Loaded = true;
        OnChange?.Invoke();
    }

    public async Task AddAsync(int amount)
    {
        if (amount <= 0) return;
        Count += amount;
        await SaveAsync();
        OnChange?.Invoke();
    }

    /// <summary>Spend stars if affordable. Returns false (and changes nothing) if too few.</summary>
    public async Task<bool> TrySpendAsync(int cost)
    {
        if (Count < cost) return false;
        Count -= cost;
        await SaveAsync();
        OnChange?.Invoke();
        return true;
    }

    private ValueTask SaveAsync() => _js.InvokeVoidAsync("saveStars", Count);
}
