<script>
    import { slide } from "svelte/transition";
    import { List, ChevronDown } from "lucide-svelte";
    import { CATEGORY_COLOR, CATEGORY_ICONS } from "../lib/constants.js";

    export let isSidebarOpen = false;
    export let isDesktop = false;
    export let forums = [];
    export let activeGroupId = null;

    function toggleSidebar() {
        if (!isDesktop) {
            isSidebarOpen = !isSidebarOpen;
        }
    }
</script>

<div class="sidebar" class:open={isSidebarOpen}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="sidebar-header" on:click={toggleSidebar}>
        <div class="sidebar-header-title">
            <List size={13} color={CATEGORY_COLOR} />
            <span>Категории</span>
        </div>
        {#if !isDesktop}
            <div
                class="sidebar-toggle"
                style="transform: {isSidebarOpen ? 'rotate(180deg)' : 'rotate(0deg)'}"
            >
                <ChevronDown size={14} />
            </div>
        {/if}
    </div>
    {#if isSidebarOpen || isDesktop}
        <div class="sidebar-menu" transition:slide|local={{ duration: 200 }}>
            {#each forums as group (group.forum_id)}
                {@const Icon = CATEGORY_ICONS[group.forum_title] || CATEGORY_ICONS.default}
                <button
                    class="sidebar-item"
                    class:active={activeGroupId === group.forum_id}
                    on:click={() => (activeGroupId = group.forum_id)}
                >
                    <div class="sidebar-icon" style={`color: ${CATEGORY_COLOR}`}>
                        {#if CATEGORY_ICONS[group.forum_title]}
                            <Icon size={14} />
                        {:else if group.icon_content}
                            <span
                                class="NodeSvgIcon"
                                style="font-size: 14px; width: 14px; height: 14px;"
                                >{@html group.icon_content}</span
                            >
                        {:else}
                            <Icon size={14} />
                        {/if}
                    </div>
                    <span class="sidebar-title">{group.forum_title}</span>
                </button>
            {/each}
        </div>
    {/if}
</div>

<style>
    .sidebar {
        width: 100%;
        background: var(--color-bg-container);
        border: 1px solid var(--color-border-default);
        border-radius: 12px;
        overflow: hidden;
        flex-shrink: 0;
    }

    @media (min-width: 768px) {
        .sidebar {
            width: 270px;
            align-self: flex-start;
            position: static;
            top: 130px;
        }
    }

    .sidebar-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        border-bottom: 1px solid var(--color-border-default);
        font-size: 12px;
        color: var(--color-text-header);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 600;
        cursor: pointer;
        user-select: none;
    }

    @media (min-width: 768px) {
        .sidebar-header {
            cursor: default;
        }
    }

    .sidebar-header-title {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .sidebar-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s ease;
        color: var(--color-text-header);
    }

    .sidebar-menu {
        display: flex;
        flex-direction: column;
        padding: 8px;
        gap: 4px;
    }

    .sidebar-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border-radius: 8px;
        background: transparent;
        border: 1px solid transparent;
        color: var(--color-text-sidebar);
        text-align: left;
        transition: all 0.2s;
        cursor: pointer;
    }

    .sidebar-item:hover {
        background: rgba(255, 255, 255, 0.03);
        color: white;
    }

    .sidebar-item.active {
        background: var(--color-bg-sidebar-active);
        border-color: var(--color-border-interactive);
        color: white;
    }

    .sidebar-icon {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.05);
    }

    .sidebar-item.active .sidebar-icon {
        background: rgba(0, 0, 0, 0.2);
    }

    .sidebar-title {
        font-size: 14px;
        font-weight: 500;
        white-space: nowrap;
    }
</style>
