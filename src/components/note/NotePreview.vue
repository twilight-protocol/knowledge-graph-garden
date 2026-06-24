<template>
  <article class="preview" v-html="htmlContent" @click="handleLinkClick" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useNoteStore } from "@/stores/noteStore";
import { useMarkdownParser } from "@/composables/useMarkdownParser";

const props = defineProps<{
  content: string;
}>();

const router = useRouter();
const noteStore = useNoteStore();
const { parse } = useMarkdownParser();

const noteMap = computed(() => {
  const map = new Map<string, string>();
  noteStore.notes.forEach((n) => map.set(n.title, n.id));
  return map;
});

const htmlContent = computed(() => parse(props.content, noteMap.value));

const handleLinkClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (target.classList.contains("wiki-link") && target.dataset.noteId) {
    e.preventDefault();
    router.push(`/note/${target.dataset.noteId}`);
  }
};
</script>

<style scoped>
.preview {
  line-height: 1.8;
  color: var(--text-primary);
}

.preview :deep(h1) {
  font-size: 24px;
  margin: 16px 0 8px;
  color: var(--text-primary);
}
.preview :deep(h2) {
  font-size: 20px;
  margin: 14px 0 7px;
  color: var(--text-primary);
}
.preview :deep(h3) {
  font-size: 17px;
  margin: 12px 0 6px;
  color: var(--text-primary);
}
.preview :deep(p) {
  margin: 8px 0;
}
.preview :deep(ul, ol) {
  padding-left: 24px;
}
.preview :deep(code) {
  background: var(--accent-bg);
  color: var(--accent);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: "JetBrains Mono", "SF Mono", Monaco, monospace;
  font-size: 0.9em;
}
.preview :deep(pre) {
  background: var(--bg-tertiary);
  padding: 16px;
  border-radius: var(--radius-md);
  overflow-x: auto;
  border: 1px solid var(--border);
}
.preview :deep(.wiki-link) {
  color: var(--accent);
  text-decoration: none;
  border-bottom: 1px dashed var(--accent-soft);
  transition: border-color 0.2s;
}
.preview :deep(.wiki-link:hover) {
  border-bottom-style: solid;
}
.preview :deep(.wiki-link-missing) {
  color: var(--text-muted);
  border-bottom-color: var(--text-muted);
}
.preview :deep(blockquote) {
  border-left: 3px solid var(--accent);
  padding-left: 12px;
  color: var(--text-secondary);
  margin: 8px 0;
}
.preview :deep(hr) {
  border: none;
  border-top: 1px solid var(--border);
  margin: 16px 0;
}
</style>
