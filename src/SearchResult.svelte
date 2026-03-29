<script>
    import { Check } from "lucide-svelte";

    /** @type {any} */
    export let forum;
    /** @type {boolean} */
    export let selected;
    /** @type {() => void} */
    export let onClick;
    /** @type {string} */
    export let query;

    function highlightData(text) {
        if (!text) return { matches: false, text: "" };
        const q = query.toLowerCase();
        const idx = text.toLowerCase().indexOf(q);
        if (idx === -1) return { matches: false, text };

        return {
            matches: true,
            before: text.slice(0, idx),
            match: text.slice(idx, idx + query.length),
            after: text.slice(idx + query.length),
        };
    }

    $: titleHl = highlightData(forum.forum_title);
    $: descHl = highlightData(forum.forum_description);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    class="search-result {selected ? 'selected' : ''}"
    class:unselectable={forum.permissions?.create_thread === false}
    on:click={onClick}
    tabindex="0"
    role="button"
>
    <div class="radio-box" class:selected>
        {#if forum.icon_content}
            <span class="NodeSvgIcon">{@html forum.icon_content}</span>
        {:else if selected}
            <Check size={10} color="#000" strokeWidth={3} />
        {/if}
    </div>

    <div class="info">
        <div class="title" class:selected-title={selected}>
            {#if titleHl.matches}
                {titleHl.before}<mark>{titleHl.match}</mark>{titleHl.after}
            {:else}
                {titleHl.text}
            {/if}
            {#if forum.parent_title}
                <span class="parent-label">в {forum.parent_title}</span>
            {/if}
        </div>

        {#if forum.forum_description}
            <p class="description">
                {#if descHl.matches}
                    {descHl.before}<mark>{descHl.match}</mark>{descHl.after}
                {:else}
                    {descHl.text}
                {/if}
            </p>
        {/if}
    </div>
</div>

<style>
    .search-result.unselectable {
        cursor: default;
        opacity: 0.6;
        pointer-events: none;
    }

    .search-result {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.15s ease;
        border: 1px solid var(--color-border-hover);
        background: var(--color-bg-item);
        margin-bottom: 6px;
    }

    .search-result:active {
        transform: scale(0.99);
    }

    .search-result:not(.selected):hover {
        background: var(--color-bg-hover);
        border-color: var(--color-border-hover);
        transform: translateX(2px);
    }

    .search-result.selected {
        background: var(--color-bg-item-selected);
        border-color: var(--color-border-item-selected);
    }

    .radio-box {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid var(--color-text-muted);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    }

    .search-result:hover .radio-box {
        border-color: var(--color-text-header);
    }

    .radio-box.selected {
        border-color: var(--color-accent-primary);
        background: var(--color-accent-primary);
    }

    .radio-box.selected:has(.NodeSvgIcon) {
        background: transparent;
        border-color: transparent;
        color: var(--color-accent-icon-active);
    }

    .radio-box:has(.NodeSvgIcon) {
        border-color: transparent !important;
        background: transparent !important;
        color: var(--color-border-hover);
    }

    .info {
        flex: 1;
        min-width: 0;
    }

    .title {
        font-size: 14px;
        color: var(--color-text-list-title);
    }

    .selected-title {
        color: var(--color-accent-primary);
    }

    .parent-label {
        font-size: 11px;
        color: var(--color-text-header);
        margin-left: 6px;
        font-weight: normal;
    }

    .description {
        font-size: 12px;
        color: var(--color-text-description);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 2px 0 0 0;
    }

    mark {
        background: var(--color-bg-mark);
        color: var(--color-accent-primary);
        border-radius: 4px;
        padding: 0 2px;
    }
</style>
