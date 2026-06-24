<template>
  <div class="editor">
    <div class="header">
      <EditorToolbar @action="handleToolbarAction" />
      <div class="mode-toggle">
        <button
          v-for="m in modes"
          :key="m.value"
          class="mode-btn"
          :class="{ active: mode === m.value }"
          @click="mode = m.value"
        >
          {{ m.label }}
        </button>
      </div>
    </div>

    <div class="body">
      <div
        v-if="mode === 'edit' || mode === 'split'"
        class="pane"
        :class="{ half: mode === 'split' }"
      >
        <input v-model="title" class="title-input" placeholder="笔记标题..." />
        <textarea
          ref="textareaRef"
          v-model="content"
          class="content-textarea"
          placeholder="开始写作...
可以使用 [[笔记标题]] 创建双向链接"
          @input="handleInput"
          @keydown="handleKeydown"
        />
      </div>

      <div
        v-if="mode === 'preview' || mode === 'split'"
        class="preview-pane"
        :class="{ half: mode === 'split' }"
      >
        <NotePreview :content="content" />
      </div>
    </div>

    <LinkAutocomplete
      ref="autocompleteRef"
      :visible="showAutocomplete"
      :query="linkQuery"
      :cursor-x="cursorX"
      :cursor-y="cursorY"
      @select="handleLinkSelect"
      @close="showAutocomplete = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue";
import { useNoteStore } from "@/stores/noteStore";
import { useMarkdownParser } from "@/composables/useMarkdownParser";
import EditorToolbar from "./EditorToolbar.vue";
import LinkAutocomplete from "./LinkAutocomplete.vue";
import NotePreview from "@/components/note/NotePreview.vue";

const noteStore = useNoteStore();
const { extractLinks } = useMarkdownParser();

const textareaRef = ref<HTMLTextAreaElement>();
const autocompleteRef = ref<InstanceType<typeof LinkAutocomplete>>();
const showAutocomplete = ref(false);
const linkQuery = ref("");
const cursorX = ref(0);
const cursorY = ref(0);
const mode = ref<"edit" | "preview" | "split">("edit");
let syncTimer: ReturnType<typeof setTimeout> | null = null;

const modes = [
  { value: "edit" as const, label: "编辑" },
  { value: "split" as const, label: "分屏" },
  { value: "preview" as const, label: "预览" },
];

const title = computed({
  get: () => noteStore.currentNote?.title || "",
  set: (val) => {
    if (noteStore.currentNote) {
      noteStore.updateNote(noteStore.currentNote.id, { title: val });
    }
  },
});

const content = computed({
  get: () => noteStore.currentNote?.content || "",
  set: (val) => {
    if (noteStore.currentNote) {
      noteStore.updateNote(noteStore.currentNote.id, { content: val });
    }
  },
});

watch(
  content,
  (val) => {
    if (!noteStore.currentNote) return;
    if (syncTimer) clearTimeout(syncTimer);
    syncTimer = setTimeout(() => {
      const titles = extractLinks(val);
      noteStore.syncLinks(noteStore.currentNote!.id, titles);
    }, 400);
  },
  { immediate: true },
);

const insertText = (before: string, after: string) => {
  const ta = textareaRef.value;
  if (!ta) return;
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  const selected = ta.value.slice(start, end);
  const newText =
    ta.value.slice(0, start) + before + selected + after + ta.value.slice(end);
  content.value = newText;
  nextTick(() => {
    const newPos = start + before.length + selected.length;
    ta.selectionStart = ta.selectionEnd = newPos;
    ta.focus();
  });
};

const handleInput = () => {
  const ta = textareaRef.value;
  if (!ta) return;
  const pos = ta.selectionStart;
  const text = ta.value.slice(0, pos);
  const match = text.match(/\[\[([^[\]]*)$/);

  if (match) {
    linkQuery.value = match[1];
    showAutocomplete.value = true;
    const rect = ta.getBoundingClientRect();
    const lines = text.slice(0, pos).split("\n");
    const lineHeight = 28;
    cursorX.value = rect.left + 20 + lines[lines.length - 1].length * 9;
    cursorY.value = rect.top + lines.length * lineHeight + 10;
  } else {
    showAutocomplete.value = false;
  }
};

const handleKeydown = (e: KeyboardEvent) => {
  if (autocompleteRef.value?.handleKeydown(e)) return;

  // Tab 键插入空格
  if (e.key === "Tab") {
    e.preventDefault();
    const ta = textareaRef.value;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const spaces = "  ";
    ta.value = ta.value.slice(0, start) + spaces + ta.value.slice(end);
    nextTick(() => {
      ta.selectionStart = ta.selectionEnd = start + spaces.length;
    });
  }

  // 快捷键
  if (e.ctrlKey || e.metaKey) {
    switch (e.key.toLowerCase()) {
      case "b":
        e.preventDefault();
        insertText("**", "**");
        break;
      case "i":
        e.preventDefault();
        insertText("*", "*");
        break;
      case "k":
        e.preventDefault();
        insertText("[", "](url)");
        break;
    }
  }
};

const handleLinkSelect = (title: string) => {
  const ta = textareaRef.value;
  if (!ta) return;
  const pos = ta.selectionStart;
  const text = ta.value;
  const before = text.slice(0, pos);
  const after = text.slice(pos);
  const match = before.match(/\[\[([^[\]]*)$/);
  if (!match) return;
  const newBefore = before.slice(0, -match[0].length) + `[[${title}]]`;
  content.value = newBefore + after;
  showAutocomplete.value = false;
  nextTick(() => {
    const newPos = newBefore.length;
    ta.selectionStart = ta.selectionEnd = newPos;
    ta.focus();
  });
};

const handleToolbarAction = (action: string) => {
  const map: Record<string, [string, string]> = {
    bold: ["**", "**"],
    italic: ["*", "*"],
    heading: ["\n### ", "\n"],
    code: ["```\n", "\n```"],
    quote: ["\n> ", "\n"],
    list: ["\n- ", "\n"],
    link: ["[", "](url)"],
  };
  const [pre, post] = map[action] || ["", ""];
  insertText(pre, post);
};
</script>

<style scoped>
.editor {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  margin: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid var(--border);
}

.mode-toggle {
  display: flex;
  gap: 2px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-sm);
  padding: 2px;
}

.mode-btn {
  background: none;
  border: none;
  padding: 4px 10px;
  font-size: 12px;
  cursor: pointer;
  border-radius: 4px;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.mode-btn.active {
  color: var(--accent);
  background: var(--bg-secondary);
  box-shadow: var(--shadow-sm);
}

.body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.pane,
.preview-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 20px;
}

.pane.half,
.preview-pane.half {
  width: 50%;
  border-right: 1px solid var(--border);
}

.title-input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 22px;
  font-weight: 700;
  line-height: 1.4;
  padding: 0 0 12px 0;
  margin-bottom: 16px;
  border-bottom: 2px solid var(--border-light);
  transition: border-color 0.2s;
  font-family: inherit;
}

.title-input:focus {
  border-bottom-color: var(--accent);
}

.title-input::placeholder {
  color: var(--text-muted);
  font-weight: 400;
}

.content-textarea {
  flex: 1;
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 16px;
  line-height: 1.8;
  resize: none;
  font-family: "JetBrains Mono", "SF Mono", Monaco, "Cascadia Code", monospace;
}

.content-textarea::placeholder {
  color: var(--text-muted);
}
</style>
