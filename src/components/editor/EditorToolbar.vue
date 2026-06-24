<template>
  <div class="editor-toolbar">
    <button
      v-for="tool in tools"
      :key="tool.action"
      class="tool-btn"
      :title="tool.title"
      @click="emit('action', tool.action)"
    >
      {{ tool.icon }}
    </button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  action: [action: string];
}>();

const tools = [
  { action: "bold", icon: "𝐁", title: "粗体" },
  { action: "italic", icon: "𝐼", title: "斜体" },
  { action: "heading", icon: "𝐇", title: "标题" },
  { action: "link", icon: "🔗", title: "链接" },
  { action: "code", icon: "⟨⟩", title: "代码" },
  { action: "quote", icon: "❝", title: "引用" },
  { action: "list", icon: "☰", title: "列表" },
];
</script>

<style scoped>
.editor-toolbar {
  display: flex;
  gap: 4px;
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
  margin-bottom: 12px;
}

.tool-btn {
  background: none;
  border: none;
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 14px;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.tool-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}
</style>
