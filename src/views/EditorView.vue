<template>
  <div class="view">
    <MarkdownEditor v-if="noteStore.currentNote" />
    <div v-else class="empty-state">
      <p>点击左侧笔记开始编辑，或创建新笔记</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { useRoute } from "vue-router";
import { useNoteStore } from "@/stores/noteStore";
import MarkdownEditor from "@/components/editor/MarkdownEditor.vue";

const route = useRoute();
const noteStore = useNoteStore();

// 根据路由参数切换当前笔记
watch(
  () => route.params.id,
  (id) => {
    if (id && typeof id === "string") {
      noteStore.setCurrentNote(id);
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.view {
  height: 100%;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-muted);
}
</style>
