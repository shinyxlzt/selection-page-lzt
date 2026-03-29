<script>
    import { Search, X } from "lucide-svelte";
    
    export let searchQuery = "";
    
    function clearSearch() {
        searchQuery = "";
    }
</script>

<div class="top-bar">
    <div class="container">
        <div class="header-row">
            <div class="title-area">
                <h1>Выбор раздела</h1>
                <p>Выберите раздел для создания новой темы</p>
            </div>
            <button class="back-btn">
                <X size={16} />
            </button>
        </div>

        <div class="search-box">
            <div class="search-icon-left">
                <Search size={15} />
            </div>
            <input
                bind:value={searchQuery}
                placeholder="Поиск раздела..."
            />
            {#if searchQuery}
                <button class="clear-btn" on:click={clearSearch}>
                    <X size={14} />
                </button>
            {/if}
        </div>
    </div>
</div>

<style>
    .top-bar {
        position: sticky;
        top: 0;
        z-index: 30;
        background: var(--color-bg-top-bar);
        backdrop-filter: blur(16px);
        border-bottom: 1px solid var(--color-border-default);
    }

    .container {
        max-width: 56rem; /* 4xl */
        margin: 0 auto;
        padding: 12px 16px;
    }

    .header-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
    }

    .back-btn {
        flex-shrink: 0;
        width: 36px;
        height: 36px;
        border-radius: 12px;
        border: 1px solid var(--color-border-default);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-text-secondary);
        transition: all 0.2s;
    }

    .back-btn:hover {
        color: white;
        border-color: var(--color-border-hover);
    }

    .title-area {
        flex: 1;
        min-width: 0;
    }

    .title-area h1 {
        color: var(--color-text-primary);
        font-size: 16px;
        margin: 0;
        font-weight: 500;
    }

    .title-area p {
        color: var(--color-text-subtitle);
        font-size: 12px;
        margin: 0;
        display: none;
    }

    @media (min-width: 640px) {
        .title-area p {
            display: block;
        }
    }

    @keyframes pulse {
        from {
            opacity: 0.3;
        }
        to {
            opacity: 1;
        }
    }

    .search-box {
        position: relative;
    }

    .search-icon-left {
        position: absolute;
        left: 14px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--color-text-description);
        pointer-events: none;
    }

    .search-box input {
        width: 100%;
        background: var(--color-bg-input);
        border: 1px solid var(--color-border-interactive);
        border-radius: 12px;
        padding: 10px 36px;
        font-size: 14px;
        color: var(--color-text-primary);
        transition: all 0.2s;
    }

    .search-box input::placeholder {
        color: var(--color-text-placeholder);
    }

    .search-box input:focus {
        outline: none;
        border-color: var(--color-accent-primary-transparent);
        background: var(--color-bg-hover);
    }

    .clear-btn {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: var(--color-text-description);
    }

    .clear-btn:hover {
        color: var(--color-text-sidebar);
    }
</style>
