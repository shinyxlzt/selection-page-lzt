<script>
    import { slide } from "svelte/transition";
    import { Search, Loader2, ArrowLeft } from "lucide-svelte";
    import forumDataRaw from "./data.json";
    import ForumItemSelectable from "./ForumItemSelectable.svelte";
    import SearchResult from "./SearchResult.svelte";
    import TopBar from "./components/TopBar.svelte";
    import Sidebar from "./components/Sidebar.svelte";
    import { parseForumData, searchForums } from "./lib/forum.js";
    import {
        CATEGORY_COLOR,
        FORUM_BASE_URL,
        TRANSITIONS,
    } from "./lib/constants.js";

    let forums = parseForumData(forumDataRaw);
    let loading = false;
    let activeGroupId = forums.length > 0 ? forums[0].forum_id : null;

    let selectedForum = null;
    let searchQuery = "";
    let isSidebarOpen = false;
    let innerWidth = 0;
    let expandedForumId = null;

    $: isDesktop = innerWidth >= 768;

    $: activeGroup =
        forums.find((f) => f.forum_id === activeGroupId) ||
        (forums.length > 0 ? forums[0] : null);

    $: searchResults = searchForums(forums, searchQuery);
    $: isSearching = searchQuery.trim().length > 0;

    function handleSelect(forum) {
        if (forum.permissions?.create_thread === false) return;
        selectedForum =
            selectedForum?.forum_id === forum.forum_id ? null : forum;
    }

    function handleConfirm() {
        if (selectedForum) {
            window.location.href = `${FORUM_BASE_URL}/${selectedForum.forum_id}/create-thread`;
        }
    }

    $: if (activeGroupId) {
        expandedForumId = null;
    }

    function handleToggleTop(forumId) {
        expandedForumId = expandedForumId === forumId ? null : forumId;
    }
</script>

<svelte:window bind:innerWidth />

<div class="main-screen">
    <TopBar bind:searchQuery />

    <!-- Content -->
    <div class="content-wrapper">
        {#if loading}
            <div class="loading-state">
                <Loader2 size={24} class="spin" />
                <span>Загрузка разделов...</span>
            </div>
        {/if}

        {#if !loading && isSearching}
            <div class="search-results-section">
                <div class="results-header">
                    <Search size={13} color="rgba(255,255,255,0.3)" />
                    <span>Найдено: {searchResults.length}</span>
                </div>

                {#if searchResults.length === 0}
                    <div class="no-results">
                        <Search size={32} class="empty-icon" />
                        <p class="empty-text">Ничего не найдено</p>
                        <p class="empty-subtext">Попробуйте другой запрос</p>
                    </div>
                {:else}
                    <div class="results-list">
                        {#each searchResults as forum (forum.forum_id)}
                            <SearchResult
                                {forum}
                                selected={selectedForum?.forum_id ===
                                    forum.forum_id}
                                onClick={() => handleSelect(forum)}
                                query={searchQuery}
                            />
                        {/each}
                    </div>
                {/if}
            </div>
        {/if}

        {#if !loading && !isSearching}
            <div class="split-layout">
                <Sidebar
                    {forums}
                    {isDesktop}
                    bind:isSidebarOpen
                    bind:activeGroupId
                />

                <div class="main-content">
                    {#if activeGroup}
                        <div class="main-header">
                            <h2 style={`color: ${CATEGORY_COLOR}`}>
                                {activeGroup.forum_title}
                            </h2>
                        </div>
                        <div class="forums-list-main fade-up-group">
                            {#each activeGroup.forums as forum, index (forum.forum_id)}
                                <ForumItemSelectable
                                    {forum}
                                    selectedId={selectedForum?.forum_id ?? null}
                                    onSelect={handleSelect}
                                    depth={0}
                                    accentColor={CATEGORY_COLOR}
                                    expanded={expandedForumId ===
                                        forum.forum_id}
                                    onToggle={handleToggleTop}
                                    isLastItem={index ===
                                        activeGroup.forums.length - 1}
                                    ancestorsLast={[]}
                                />
                            {/each}
                        </div>
                    {/if}
                </div>
            </div>
        {/if}
    </div>

    <!-- Bottom action bar -->
    {#if selectedForum}
        <div
            class="bottom-bar"
            transition:slide|local={{
                duration: TRANSITIONS.slideLong.duration,
            }}
        >
            <div class="bottom-bar-content">
                <div class="bottom-info">
                    <p class="label">Выбранный раздел:</p>
                    <div class="selected-row">
                        <span class="selected-title-sm"
                            >{selectedForum.forum_title}</span
                        >
                    </div>
                </div>
                <button class="confirm-btn" on:click={handleConfirm}>
                    Создать тему
                    <ArrowLeft size={16} style="transform: rotate(180deg);" />
                </button>
            </div>
        </div>
    {/if}
</div>

<style>
    .fade-up-group {
        opacity: 0;
        animation: fadeUp 0.3s ease-out forwards;
    }
    @keyframes fadeUp {
        from {
            opacity: 0;
            transform: translateY(12px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
    :global(.spin) {
        animation: spin 1s linear infinite;
        margin-right: 8px;
    }

    .main-screen {
        min-height: 100vh;
        background: var(--color-bg-page);
        display: flex;
        flex-direction: column;
    }

    .content-wrapper {
        flex: 1;
        max-width: 56rem;
        margin: 0 auto;
        width: 100%;
        padding: 16px 16px 112px 16px;
    }

    .loading-state {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 64px 0;
        color: var(--color-text-description);
        font-size: 14px;
    }

    .search-results-section {
        display: flex;
        flex-direction: column;
        max-height: calc(100vh - 250px);
        background: var(--color-bg-container);
        border: 1px solid var(--color-border-default);
        border-radius: 12px;
        padding: 16px;
    }

    .results-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
        flex: 1;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: var(--color-accent-primary) transparent;
        padding-right: 6px;
        margin-right: -6px;
    }

    .results-list::-webkit-scrollbar {
        width: 6px;
    }

    .results-list::-webkit-scrollbar-track {
        background: transparent;
    }

    .results-list::-webkit-scrollbar-thumb {
        background: var(--color-accent-primary);
        border-radius: 10px;
    }

    .results-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        font-size: 12px;
        color: var(--color-text-subtitle);
        flex-shrink: 0;
    }

    .no-results {
        text-align: center;
        padding: 48px 0;
        color: var(--color-text-placeholder);
    }

    .empty-text {
        font-size: 14px;
        margin: 0 0 4px 0;
        color: var(--color-text-sidebar);
    }

    .empty-subtext {
        font-size: 12px;
        margin: 0;
        color: var(--color-text-description);
    }

    .split-layout {
        display: flex;
        gap: 20px;
        flex-direction: column;
    }

    @media (min-width: 768px) {
        .split-layout {
            flex-direction: row;
        }
    }

    .main-content {
        flex: 1;
        min-width: 0;
        background: var(--color-bg-container);
        border: 1px solid var(--color-border-default);
        border-radius: 12px;
        overflow: hidden;
        padding: 16px;
        display: flex;
        flex-direction: column;
        max-height: calc(100vh - 250px);
    }

    @media (min-width: 768px) {
        .main-content {
            position: static;
            top: 130px;
            align-self: flex-start;
        }
    }

    .main-header {
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--color-border-default);
        flex-shrink: 0;
    }

    .main-header h2 {
        font-size: 18px;
        margin: 0 0 4px 0;
        color: white;
        font-weight: 600;
    }

    .forums-list-main {
        display: flex;
        flex-direction: column;
        gap: 2px;
        flex: 1;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: var(--color-accent-primary) transparent;
        padding-right: 6px;
        margin-right: -6px;
    }

    .forums-list-main::-webkit-scrollbar {
        width: 6px;
    }

    .forums-list-main::-webkit-scrollbar-track {
        background: transparent;
    }

    .forums-list-main::-webkit-scrollbar-thumb {
        background: var(--color-accent-primary);
        border-radius: 10px;
    }

    .bottom-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 40;
    }

    .bottom-bar-content {
        background: var(--color-bg-bottom-bar);
        backdrop-filter: blur(16px);
        border-top: 1px solid var(--color-border-interactive);
        max-width: 56rem;
        margin: 0 auto;
        padding: 12px 16px;
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .bottom-info {
        flex: 1;
        min-width: 0;
    }

    .label {
        font-size: 11px;
        color: var(--color-text-description);
        margin: 0 0 2px 0;
    }

    .selected-row {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .selected-title-sm {
        font-size: 14px;
        font-weight: 500;
        color: var(--color-accent-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .confirm-btn {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        border-radius: 12px;
        background: var(--color-accent-primary);
        color: #000;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s;
    }

    .confirm-btn:hover {
        background: var(--color-accent-primary-transparent);
    }
</style>
