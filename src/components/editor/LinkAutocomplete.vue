<template>
  <div
    v-if="visible && filteredNotes.length > 0"
    class="link-autocomplete"
    :style="positionStyle"
  >
    <div
      v-for="(note, index) in filteredNotes"
      :key="note.id"
      class="autocomplete-item"
      :class="{ selected: index === selectedIndex }"
      @click="handleSelect(note.title)"
      @mouseenter="selectedIndex = index"
    >
      <span class="item-title">{{ note.title || "无标题" }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useNoteStore } from "@/stores/noteStore";

const props = defineProps<{
  visible: boolean;
  query: string;
  cursorX: number;
  cursorY: number;
}>();

const emit = defineEmits<{
  select: [title: string];
  close: [];
}>();

const noteStore = useNoteStore();
const selectedIndex = ref(0);

const filteredNotes = computed(() => {
  if (!props.query) return noteStore.sortedNotes.slice(0, 8);
  const q = props.query.toLowerCase();
  return noteStore.sortedNotes
    .filter((n) => (n.title || "无标题").toLowerCase().includes(q))
    .slice(0, 8);
});

const positionStyle = computed(() => ({
  position: "fixed" as const,
  top: `${props.cursorY + 20}px`,
  left: `${Math.min(props.cursorX, window.innerWidth - 280)}px`,
  zIndex: 1000,
}));

watch(
  () => props.visible,
  (v) => {
    if (v) selectedIndex.value = 0;
  },
);
watch(
  () => props.query,
  () => {
    selectedIndex.value = 0;
  },
);

const handleKeydown = (e: KeyboardEvent) => {
  if (!props.visible || filteredNotes.value.length === 0) return false;
  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      selectedIndex.value =
        (selectedIndex.value + 1) % filteredNotes.value.length;
      return true;
    case "ArrowUp":
      e.preventDefault();
      selectedIndex.value =
        (selectedIndex.value - 1 + filteredNotes.value.length) %
        filteredNotes.value.length;
      return true;
    case "Enter":
      e.preventDefault();
      handleSelect(filteredNotes.value[selectedIndex.value].title);
      return true;
    case "Escape":
      emit("close");
      return true;
  }
  return false;
};

const handleSelect = (title: string) => {
  emit("select", title);
};

defineExpose({ handleKeydown });
</script>

<style scoped>
.link-autocomplete {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  min-width: 220px;
  max-width: 280px;
  overflow: hidden;
}

.autocomplete-item {
  padding: 10px 14px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-primary);
  transition: background 0.15s;
}

.autocomplete-item:hover,
.autocomplete-item.selected {
  background: var(--accent-bg);
}

.autocomplete-item.selected {
  background: var(--accent-bg-hover);
}

.item-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
