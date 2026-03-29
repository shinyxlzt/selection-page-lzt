<script>
    import { slide } from "svelte/transition";
    import {
        Search,
        ArrowLeft,
        X,
        Loader2,
        List,
        TrendingUp,
        Hash,
        MessageSquarePlus,
        ChevronDown,
        BookOpenText,
        Users,
        Gamepad2,
    } from "lucide-svelte";
    import forumDataRaw from "./data.json";
    import ForumItemSelectable from "./ForumItemSelectable.svelte";
    import SearchResult from "./SearchResult.svelte";

    function parseForumData(data) {
        if (!data || !data.data) return [];

        let allNodes = [];
        if (Array.isArray(data.data)) {
            data.data.forEach((group) => {
                if (Array.isArray(group)) allNodes.push(...group);
                else allNodes.push(group);
            });
        }

        let nodeMap = {};
        let parsedForums = [];

        allNodes.forEach((node) => {
            if (typeof node === "object" && node !== null) {
                node.forums = [];
                nodeMap[node.forum_id] = node;
            }
        });

        allNodes.forEach((node) => {
            if (typeof node === "object" && node !== null) {
                if (node.parent_node_id && nodeMap[node.parent_node_id]) {
                    nodeMap[node.parent_node_id].forums.push(node);
                } else {
                    parsedForums.push(node);
                }
            }
        });

        return parsedForums;
    }

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

    const CATEGORY_COLOR = "#2BAD72";

    function searchForums(groups, query) {
        const q = query.toLowerCase().trim();
        if (!q) return [];
        const all = flattenForums(groups);
        return all.filter(
            (f) =>
                f.forum_title.toLowerCase().includes(q) ||
                f.forum_description?.toLowerCase().includes(q),
        );
    }

    function flattenForums(groups) {
        const result = [];
        function traverse(forums, depth = 0, parentTitle = null) {
            for (const forum of forums) {
                result.push({ ...forum, depth, parent_title: parentTitle });
                if (forum.forums && forum.forums.length > 0) {
                    traverse(forum.forums, depth + 1, forum.forum_title);
                }
            }
        }
        for (const group of groups) {
            if (group.forums) {
                traverse(group.forums, 0, group.forum_title);
            }
        }
        return result;
    }

    $: searchResults = searchForums(forums, searchQuery);
    $: isSearching = searchQuery.trim().length > 0;

    function handleSelect(forum) {
        if (forum.permissions?.create_thread === false) return;
        selectedForum =
            selectedForum?.forum_id === forum.forum_id ? null : forum;
    }

    function handleConfirm() {
        if (selectedForum) {
            window.location.href = `https://lolz.live/forums/${selectedForum.forum_id}/create-thread`;
        }
    }

    function clearSearch() {
        searchQuery = "";
    }

    function toggleSidebar() {
        if (!isDesktop) {
            isSidebarOpen = !isSidebarOpen;
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
    <!-- Top Bar -->
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
                <div class="sidebar" class:open={isSidebarOpen}>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div class="sidebar-header" on:click={toggleSidebar}>
                        <div class="sidebar-header-title">
                            <List size={13} color="#2BAD72" />
                            <span>Категории</span>
                        </div>
                        {#if !isDesktop}
                            <div
                                class="sidebar-toggle"
                                style="transform: {isSidebarOpen
                                    ? 'rotate(180deg)'
                                    : 'rotate(0deg)'}"
                            >
                                <ChevronDown size={14} />
                            </div>
                        {/if}
                    </div>
                    {#if isSidebarOpen || isDesktop}
                        <div
                            class="sidebar-menu"
                            transition:slide|local={{ duration: 200 }}
                        >
                            {#each forums as group (group.forum_id)}
                                <button
                                    class="sidebar-item"
                                    class:active={activeGroup?.forum_id ===
                                        group.forum_id}
                                    on:click={() =>
                                        (activeGroupId = group.forum_id)}
                                >
                                    <div
                                        class="sidebar-icon"
                                        style={`color: ${CATEGORY_COLOR}`}
                                    >
                                        {#if group.forum_title === "Основная категория"}
                                            <TrendingUp size={14} />
                                        {:else if group.forum_title === "Тематическая категория"}
                                            <BookOpenText size={14} />
                                        {:else if group.forum_title === "Игровая категория"}
                                            <Gamepad2 size={14} />
                                        {:else if group.forum_title === "Общая категория"}
                                            <MessageSquarePlus size={14} />
                                        {:else if group.forum_title === "Пользовательские разделы"}
                                            <Users size={14} />
                                        {:else if group.icon_content}
                                            <span
                                                class="NodeSvgIcon"
                                                style="font-size: 14px; width: 14px; height: 14px;"
                                                >{@html group.icon_content}</span
                                            >
                                        {:else}
                                            <Hash size={14} />
                                        {/if}
                                    </div>
                                    <span class="sidebar-title"
                                        >{group.forum_title}</span
                                    >
                                </button>
                            {/each}
                        </div>
                    {/if}
                </div>

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
        <div class="bottom-bar" transition:slide|local={{ duration: 300 }}>
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
        background: #080808;
        display: flex;
        flex-direction: column;
    }

    .top-bar {
        position: sticky;
        top: 0;
        z-index: 30;
        background: rgba(8, 8, 8, 0.95);
        backdrop-filter: blur(16px);
        border-bottom: 1px solid #2d2d2d;
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
        border: 1px solid #2d2d2d;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(255, 255, 255, 0.5);
        transition: all 0.2s;
    }

    .back-btn:hover {
        color: white;
        border-color: #505050;
    }

    .title-area {
        flex: 1;
        min-width: 0;
    }

    .title-area h1 {
        color: rgba(255, 255, 255, 0.9);
        font-size: 16px;
        margin: 0;
        font-weight: 500;
    }

    .title-area p {
        color: rgba(255, 255, 255, 0.35);
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
        color: rgba(255, 255, 255, 0.3);
        pointer-events: none;
    }

    .search-box input {
        width: 100%;
        background: #272727;
        border: 1px solid #363636;
        border-radius: 12px;
        padding: 10px 36px;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.9);
        transition: all 0.2s;
    }

    .search-box input::placeholder {
        color: rgba(255, 255, 255, 0.25);
    }

    .search-box input:focus {
        outline: none;
        border-color: rgba(43, 173, 114, 0.5);
        background: #303030;
    }

    .clear-btn {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: rgba(255, 255, 255, 0.3);
    }

    .clear-btn:hover {
        color: rgba(255, 255, 255, 0.6);
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
        color: rgba(255, 255, 255, 0.3);
        font-size: 14px;
    }

    .search-results-section {
        display: flex;
        flex-direction: column;
        max-height: calc(100vh - 250px);
        background: #111;
        border: 1px solid #2d2d2d;
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
        scrollbar-color: #2bad72 transparent;
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
        background: #2bad72;
        border-radius: 10px;
    }

    .results-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.35);
        flex-shrink: 0;
    }

    .no-results {
        text-align: center;
        padding: 48px 0;
        color: rgba(255, 255, 255, 0.25);
    }

    .empty-text {
        font-size: 14px;
        margin: 0 0 4px 0;
        color: rgba(255, 255, 255, 0.7);
    }

    .empty-subtext {
        font-size: 12px;
        margin: 0;
        color: rgba(255, 255, 255, 0.3);
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

    .sidebar {
        width: 100%;
        background: #111;
        border: 1px solid #2d2d2d;
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
        border-bottom: 1px solid #2d2d2d;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.4);
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
        color: rgba(255, 255, 255, 0.4);
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
        color: rgba(255, 255, 255, 0.7);
        text-align: left;
        transition: all 0.2s;
        cursor: pointer;
    }

    .sidebar-item:hover {
        background: rgba(255, 255, 255, 0.03);
        color: white;
    }

    .sidebar-item.active {
        background: #272727;
        border-color: #363636;
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

    .main-content {
        flex: 1;
        min-width: 0;
        background: #111;
        border: 1px solid #2d2d2d;
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
        border-bottom: 1px solid #2d2d2d;
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
        scrollbar-color: #2bad72 transparent;
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
        background: #2bad72;
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
        background: rgba(45, 45, 45, 0.95);
        backdrop-filter: blur(16px);
        border-top: 1px solid #363636;
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
        color: rgba(255, 255, 255, 0.3);
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
        color: #2bad72;
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
        background: #2bad72;
        color: #000;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s;
    }

    .confirm-btn:hover {
        background: rgba(43, 173, 114, 0.9);
    }
</style>
