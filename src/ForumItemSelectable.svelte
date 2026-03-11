<script>
    import { Check, ChevronRight } from "lucide-svelte";
    import { slide } from "svelte/transition";

    /** @type {any} */
    export let forum;
    /** @type {number | null} */
    export let selectedId;
    /** @type {(forum: any) => void} */
    export let onSelect;
    /** @type {number} */
    export let depth = 0;
    /** @type {string} */
    export let accentColor = "#2BAD72";
    export let expanded = false;
    export let onToggle = (id) => {};
    export let isLastItem = false;
    export let ancestorsLast = [];

    $: hasChildren = forum.forums && forum.forums.length > 0;
    $: isSelected = forum.forum_id === selectedId;

    let expandedChildId = null;
    let elementParent;

    $: if (!expanded) {
        expandedChildId = null;
    } else if (expanded && elementParent) {
        // Поднимаем скролл к родителю при открытии
        setTimeout(() => {
            elementParent.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }, 200);
    }

    function isChildSelectedFunc(forumsItems) {
        return forumsItems.some(
            (f) =>
                f.forum_id === selectedId ||
                (f.forums ? isChildSelectedFunc(f.forums) : false),
        );
    }

    $: childSelected = hasChildren && isChildSelectedFunc(forum.forums);

    function handleClick() {
        onSelect(forum);
        if (hasChildren) onToggle(forum.forum_id);
    }

    function handleChildToggle(childId) {
        expandedChildId = expandedChildId === childId ? null : childId;
    }
</script>

<div class="forum-item-container" bind:this={elementParent}>
    <div
        role="button"
        tabindex="0"
        class="forum-item {isSelected
            ? 'selected'
            : childSelected
              ? 'child-selected'
              : 'default'}"
        style="padding-left: {12 + depth * 18}px;"
        on:click={handleClick}
        on:keydown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleClick();
        }}
    >
        {#each Array(depth) as _, i}
            <!-- Вертикальная линия для каждого уровня вложенности -->
            {#if i === depth - 1 || !ancestorsLast[i + 1]}
                <div
                    class="depth-line {i === depth - 1 ? 'last-depth' : ''}"
                    class:active-depth={i === depth - 1 &&
                        (expanded || childSelected || isSelected)}
                    class:half-line={i === depth - 1 && isLastItem}
                    style="left: {(i + 1) * 18 -
                        6}px; background: {accentColor};"
                ></div>
            {/if}

            <!-- Горизонтальная соединительная линия (L-shape) -->
            {#if i === depth - 1}
                <div
                    class="depth-horizontal"
                    class:active-depth={expanded || childSelected || isSelected}
                    class:rotated-depth={expanded && !isLastItem}
                    style="left: {(i + 1) * 18 -
                        6}px; background: {accentColor};"
                ></div>
            {/if}
        {/each}

        <div
            class="radio-box"
            class:selected={isSelected}
            class:child-selected={!isSelected && childSelected}
        >
            {#if forum.icon_content}
                <span class="NodeSvgIcon">{@html forum.icon_content}</span>
            {:else if isSelected}
                <Check size={10} color="#000" strokeWidth={3} />
            {:else if childSelected}
                <div class="dot"></div>
            {/if}
        </div>

        <div class="info">
            <div class="title-row">
                <span class="title" class:selected-title={isSelected}
                    >{forum.forum_title}</span
                >
                {#if forum.has_new_posts}
                    <span class="new-badge">NEW</span>
                {/if}
            </div>
            {#if forum.forum_description}
                <p class="description">{forum.forum_description}</p>
            {/if}
        </div>

        {#if hasChildren}
            <div class="expand-icon" class:expanded>
                <ChevronRight size={14} />
            </div>
        {/if}
    </div>

    {#if hasChildren && expanded}
        <div
            transition:slide|local={{ duration: 200 }}
            class="children-container"
        >
            <div class="children">
                {#each forum.forums as child, index (child.forum_id)}
                    <svelte:self
                        forum={child}
                        {selectedId}
                        {onSelect}
                        depth={depth + 1}
                        {accentColor}
                        expanded={expandedChildId === child.forum_id}
                        onToggle={handleChildToggle}
                        isLastItem={index === forum.forums.length - 1}
                        ancestorsLast={[...(ancestorsLast || []), isLastItem]}
                    />
                {/each}
            </div>
        </div>
    {/if}
</div>

<style>
    .forum-item-container {
        margin-bottom: 2px;
    }

    .forum-item {
        position: relative;
        display: flex;
        align-items: center;
        gap: 12px;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.15s ease;
        user-select: none;
        padding: 10px 12px;
        border: 1px solid transparent;
    }

    .forum-item:active {
        transform: scale(0.99);
    }

    .forum-item.default:hover {
        background: #303030;
        border-color: #505050;
    }

    .forum-item.selected {
        background: rgba(43, 173, 114, 0.15);
        border-color: rgba(43, 173, 114, 0.4);
    }

    .forum-item.child-selected {
        background: #2d2d2d;
        border-color: #505050;
    }

    /* Линии иерархии */
    .depth-line {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 1px;
        opacity: 0.15;
        transition:
            opacity 0.3s ease,
            background 0.3s ease;
    }

    .depth-line.half-line {
        bottom: 50%; /* Создает истинную L форму для последнего элемента */
    }

    .depth-horizontal {
        position: absolute;
        top: 50%;
        width: 14px;
        height: 1px;
        opacity: 0.15;
        transform-origin: left center;
        transition: all 0.3s ease;
    }

    .depth-line.active-depth,
    .depth-horizontal.active-depth {
        opacity: 0.6;
    }

    .depth-horizontal.rotated-depth {
        width: 12px;
        transform: rotate(
            15deg
        ); /* Небольшой поворот при раскрытии (эстетический эффект) */
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

    .forum-item:hover .radio-box {
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

    .radio-box.child-selected {
        border-color: rgba(43, 173, 114, 0.5);
    }

    .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(43, 173, 114, 0.5);
    }

    .info {
        flex: 1;
        min-width: 0;
    }

    .title-row {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .title {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.85);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: color 0.15s;
    }

    .forum-item:hover .title {
        color: white;
    }

    .selected-title {
        color: #2bad72 !important;
    }

    .new-badge {
        flex-shrink: 0;
        font-size: 9px;
        padding: 2px 6px;
        border-radius: 10px;
        background: rgba(43, 173, 114, 0.2);
        color: #2bad72;
        border: 1px solid rgba(43, 173, 114, 0.3);
        display: none;
    }

    @media (min-width: 640px) {
        .new-badge {
            display: inline;
        }
    }

    .description {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.3);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 2px 0 0 0;
    }

    .expand-icon {
        flex-shrink: 0;
        color: rgba(255, 255, 255, 0.25);
        margin-left: 4px;
        transition: transform 0.2s;
    }

    .expand-icon.expanded {
        transform: rotate(90deg);
    }

    .children-container {
        overflow: hidden;
    }

    .children {
        margin-top: 2px;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }
</style>
