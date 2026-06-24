<template>
  <aside class="sidebar">
    <button class="new-note-btn" @click="CreateNote">+ 新建笔记</button>

    <div class="note-list">
      <div
        v-for="note in noteStore.sortedNotes"
        :key="note.id"
        class="note-item"
        :class="{ active: note.id === noteStore.currentNoteId }"
        @click="SelectNote(note.id)"
        @dblclick="startRename(note)"
      >
        <div class="note-row">
          <div class="note-title-col">
            <input
              v-if="editingId === note.id"
              ref="renameInputRef"
              v-model="renameValue"
              class="rename-input"
              @keydown.enter="finishRename(note.id)"
              @keydown.escape="editingId = null"
              @blur="finishRename(note.id)"
              @click.stop
            />
            <div v-else class="note-title">{{ note.title || "无标题" }}</div>
            <div class="note-time">{{ formatTime(note.updatedAt) }}</div>
          </div>
          <button
            class="delete-btn"
            title="删除笔记"
            @click.stop="DeleteNote(note.id)"
          >
            🗑
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useNoteStore } from "@/stores/noteStore";
import type { Note } from "@/types";

const router = useRouter();
const noteStore = useNoteStore();

const editingId = ref<string | null>(null);
const renameValue = ref("");
const renameInputRef = ref<HTMLInputElement | HTMLInputElement[]>();

const CreateNote = () => {
  const title = "新笔记";
  const id = noteStore.createNote(title);
  router.push(`/note/${id}`);
};

const SelectNote = (id: string) => {
  if (editingId.value) return;
  noteStore.setCurrentNote(id);
  router.push(`/note/${id}`);
};

const startRename = (note: Note) => {
  editingId.value = note.id;
  renameValue.value = note.title;
  nextTick(() => {
    const el = Array.isArray(renameInputRef.value)
      ? renameInputRef.value[renameInputRef.value.length - 1]
      : renameInputRef.value;
    (el as HTMLInputElement)?.focus();
    (el as HTMLInputElement)?.select();
  });
};

const finishRename = (id: string) => {
  if (editingId.value !== id) return;
  const newTitle = renameValue.value.trim();
  if (
    newTitle &&
    newTitle !== noteStore.notes.find((n) => n.id === id)?.title
  ) {
    noteStore.updateNote(id, { title: newTitle });
  }
  editingId.value = null;
};

const DeleteNote = (id: string) => {
  const note = noteStore.notes.find((n) => n.id === id);
  if (!note) return;
  if (!confirm(`确定删除笔记「${note.title || "无标题"}」吗？此操作不可恢复。`))
    return;
  noteStore.deleteNote(id);
};

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
};
</script>

<style scoped>
.sidebar {
  width: 280px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border);
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.new-note-btn {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, var(--accent), var(--accent-soft));
  color: #fff;
  border: none;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 16px;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
}

.new-note-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
}

.note-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.note-item {
  padding: 12px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background 0.2s;
}

.note-item:hover {
  background: var(--bg-hover);
}

.note-item.active {
  background: var(--accent-bg);
  color: var(--accent);
}

.note-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.note-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.note-title-col {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.delete-btn {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 14px;
  cursor: pointer;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition:
    opacity 0.2s,
    background 0.2s,
    color 0.2s;
}

.note-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.rename-input {
  width: 100%;
  border: none;
  outline: none;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid var(--accent);
}

.note-time {
  font-size: 12px;
  color: var(--text-muted);
}
</style>
