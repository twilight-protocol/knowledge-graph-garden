import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useLocalStorage } from "@/composables/useLocalStorage";
import { generateId } from "@/utils/idGenerator";
import type { Note } from "@/types/index";

export const useNoteStore = defineStore("notes", () => {
  //state
  const notes = useLocalStorage<Note[]>("kg-notes", []);
  const currentNoteId = ref<string | null>(null);

  const currentNote = computed(() => {
    if (!currentNoteId.value) return null;
    return notes.value.find((n) => n.id === currentNoteId.value) || null;
  });

  const sortedNotes = computed(() => {
    return [...notes.value].sort((a, b) => b.updatedAt - a.updatedAt);
  });

  //actions
  const createNote = (title: string, content: string = "") => {
    const now = Date.now();
    const newNote: Note = {
      id: generateId(),
      title,
      content,
      tags: [],
      links: [],
      backlinks: [],
      createdAt: now,
      updatedAt: now,
    };
    notes.value.unshift(newNote);
    currentNoteId.value = newNote.id;
    return newNote.id;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    const note = notes.value.find((n) => n.id === id);
    if (!note) return;
    Object.assign(note, updates, { updatedAt: Date.now() });
  };

  const deleteNote = (id: string) => {
    const index = notes.value.findIndex((n) => n.id === id);
    if (index === -1) return;

    notes.value.forEach((n) => {
      if (n.id === id) return;
      n.links = n.links.filter((lid) => lid !== id);
      n.backlinks = n.backlinks.filter((bid) => bid !== id);
    });

    notes.value.splice(index, 1);

    if (currentNoteId.value === id) {
      currentNoteId.value = notes.value.length > 0 ? notes.value[0].id : null;
    }
  };

  const setCurrentNote = (id: string) => {
    currentNoteId.value = id;
  };

  const syncLinks = (sourceId: string, titles: string[]) => {
    const source = notes.value.find((n) => n.id === sourceId);
    if (!source) return;

    const newLinks: string[] = [];
    const backlinkMap = new Map<string, string[]>();

    titles.forEach((title) => {
      const trimmed = title.trim();
      // 大小写不敏感匹配：优先精确匹配，其次不区分大小写
      const target =
        notes.value.find((n) => n.title === trimmed) ??
        notes.value.find(
          (n) => n.title.toLowerCase() === trimmed.toLowerCase(),
        );
      if (target && target.id !== sourceId) {
        newLinks.push(target.id);
        const existing = backlinkMap.get(target.id) || [];
        backlinkMap.set(target.id, [...existing, sourceId]);
      }
    });

    source.links = [...new Set(newLinks)];

    notes.value.forEach((n) => {
      if (n.id === sourceId) return;
      const hasBacklink = backlinkMap.has(n.id);
      const currentBacklinks = [...n.backlinks];

      if (hasBacklink && !currentBacklinks.includes(sourceId)) {
        n.backlinks = [...currentBacklinks, sourceId];
      } else if (!hasBacklink && currentBacklinks.includes(sourceId)) {
        n.backlinks = currentBacklinks.filter((id) => id !== sourceId);
      }
    });
  };

  return {
    notes,
    currentNoteId,
    currentNote,
    sortedNotes,
    createNote,
    updateNote,
    deleteNote,
    setCurrentNote,
    syncLinks,
  };
});
