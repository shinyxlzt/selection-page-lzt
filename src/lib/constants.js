import {
    TrendingUp,
    BookOpenText,
    Gamepad2,
    MessageSquarePlus,
    Users,
    Hash
} from "lucide-svelte";

export const COLORS = {
    bg: {
        page: "var(--pageBackground)",
        container: "var(--contentBackground)",
        input: "var(--primaryDarker)",
        item: "var(--primaryDarker)",
        hover: "var(--primaryDark)",
        sidebarActive: "var(--primaryDarker)",
        itemSelected: "rgba(0, 186, 120, 0.15)",
        itemChildSelected: "var(--primaryDarker)",
        bottomBar: "rgba(45, 45, 45, 0.95)"
    },
    border: {
        default: "var(--primaryDark)",
        interactive: "var(--primaryLighter)",
        hover: "var(--primaryLightest)",
        itemSelected: "rgba(0, 186, 120, 0.4)",
        itemChildSelected: "var(--primaryLightest)"
    },
    accent: {
        primary: "rgb(0, 186, 120)",
        primaryTransparent: "rgba(0, 186, 120, 0.5)",
        primarySoft: "rgba(0, 186, 120, 0.15)",
        iconActive: "rgb(0, 186, 120)"
    },
    text: {
        primary: "var(--faintTextColor)",
        listTitle: "var(--contentText)",
        sidebar: "var(--mutedTextColor)",
        secondary: "var(--dimmedTextColor)",
        header: "var(--dimmedTextColor)",
        subtitle: "var(--mutedTextColor)",
        description: "var(--mutedTextColor)",
        placeholder: "var(--mutedTextColor)",
        muted: "var(--mutedTextColor)"
    }
};

export const CATEGORY_COLOR = COLORS.accent.primary;
export const FORUM_BASE_URL = "https://lolz.live/forums";

export const CATEGORY_ICONS = {
    "Основная категория": TrendingUp,
    "Тематическая категория": BookOpenText,
    "Игровая категория": Gamepad2,
    "Общая категория": MessageSquarePlus,
    "Пользовательские разделы": Users,
    "default": Hash
};

export const TRANSITIONS = {
    slide: { duration: 200 },
    slideLong: { duration: 300 }
};
