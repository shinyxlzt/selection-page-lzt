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
        border: 1px solid #505050;
        background: #272727;
        margin-bottom: 6px;
    }

    .search-result:active {
        transform: scale(0.99);
    }

    .search-result:not(.selected):hover {
        background: #303030;
        border-color: #505050;
        transform: translateX(2px);
    }

    .search-result.selected {
        background: rgba(43, 173, 114, 0.15);
        border-color: rgba(43, 173, 114, 0.4);
    }

    .radio-box {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    }

    .search-result:hover .radio-box {
        border-color: rgba(255, 255, 255, 0.4);
    }

    .radio-box.selected {
        border-color: #2bad72;
        background: #2bad72;
    }

    .radio-box.selected:has(.NodeSvgIcon) {
        background: transparent;
        border-color: transparent;
        color: #00ba78;
    }

    .radio-box:has(.NodeSvgIcon) {
        border-color: transparent !important;
        background: transparent !important;
        color: #505050;
    }

    .info {
        flex: 1;
        min-width: 0;
    }

    .title {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.85);
    }

    .selected-title {
        color: #2bad72;
    }

    .parent-label {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.4);
        margin-left: 6px;
        font-weight: normal;
    }

    .description {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.3);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 2px 0 0 0;
    }

    mark {
        background: rgba(43, 173, 114, 0.3);
        color: #2bad72;
        border-radius: 4px;
        padding: 0 2px;
    }
</style>
