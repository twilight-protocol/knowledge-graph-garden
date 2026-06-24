import { computed } from "vue";
import { useNoteStore } from "@/stores/noteStore";
import type { GraphNode, GraphLink } from "@/types";

const COLORS = [
  "#10b981",
  "#34d399",
  "#14b8a6",
  "#22d3ee",
  "#06b6d4",
  "#f59e0b",
  "#f97316",
  "#8b5cf6",
];

export function useGraphData() {
  const noteStore = useNoteStore();

  const nodes = computed<GraphNode[]>(() => {
    return noteStore.notes.map((note, index) => ({
      id: note.id,
      title: note.title || "无标题",
      radius: Math.max(
        20,
        10 + note.links.length * 5 + note.backlinks.length * 3,
      ),
      color: COLORS[index % COLORS.length],
    }));
  });

  const links = computed<GraphLink[]>(() => {
    const result: GraphLink[] = [];
    const addLink = (sourceId: string, targetId: string) => {
      if (
        sourceId === targetId ||
        !noteStore.notes.some((n) => n.id === targetId)
      )
        return;
      const exists = result.some(
        (l) =>
          (l.source === sourceId && l.target === targetId) ||
          (l.source === targetId && l.target === sourceId),
      );
      if (!exists) {
        result.push({ source: sourceId, target: targetId, strength: 0.5 });
      }
    };

    noteStore.notes.forEach((note) => {
      // 正向链接
      note.links.forEach((targetId) => addLink(note.id, targetId));
      // 反向链接（让图谱更完整）
      note.backlinks.forEach((sourceId) => addLink(sourceId, note.id));
    });
    return result;
  });

  const stats = computed(() => ({
    nodeCount: nodes.value.length,
    linkCount: links.value.length,
    isolatedCount: nodes.value.filter(
      (n) => !links.value.some((l) => l.source === n.id || l.target === n.id),
    ).length,
  }));

  return { nodes, links, stats };
}
