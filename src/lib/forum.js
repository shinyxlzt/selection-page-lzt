export function parseForumData(data) {
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

export function searchForums(groups, query) {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    const all = flattenForums(groups);
    return all.filter(
        (f) =>
            f.forum_title.toLowerCase().includes(q) ||
            f.forum_description?.toLowerCase().includes(q),
    );
}

export function flattenForums(groups) {
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
