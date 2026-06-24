<template>
  <div class="graph-controls">
    <div class="stats-panel">
      <div class="stat-item">
        <span class="stat-value">{{ stats.nodeCount }}</span>
        <span class="stat-label">笔记</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ stats.linkCount }}</span>
        <span class="stat-label">连接</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ stats.isolatedCount }}</span>
        <span class="stat-label">孤立</span>
      </div>
    </div>

    <div class="control-buttons">
      <button class="ctrl-btn" @click="emit('reset')" title="重置视图">
        ⌂
      </button>
      <button
        class="ctrl-btn"
        @click="emit('toggleSimulation')"
        title="暂停/恢复"
      >
        {{ isRunning ? "⏸" : "▶" }}
      </button>
      <button class="ctrl-btn" @click="emit('zoomIn')" title="放大">+</button>
      <button class="ctrl-btn" @click="emit('zoomOut')" title="缩小">−</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGraphData } from "@/composables/useGraphData";

defineProps<{
  isRunning?: boolean;
}>();

const { stats } = useGraphData();

const emit = defineEmits<{
  reset: [];
  toggleSimulation: [];
  zoomIn: [];
  zoomOut: [];
}>();
</script>

<style scoped>
.graph-controls {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-end;
}

.stats-panel {
  background: var(--bg-secondary);
  backdrop-filter: blur(8px);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 10px 14px;
  display: flex;
  gap: 16px;
  box-shadow: var(--shadow-sm);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--accent);
}

.stat-label {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 2px;
}

.control-buttons {
  display: flex;
  gap: 6px;
}

.ctrl-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: var(--bg-secondary);
  backdrop-filter: blur(8px);
  color: var(--text-primary);
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-shadow: var(--shadow-sm);
}

.ctrl-btn:hover {
  background: var(--accent-bg);
  border-color: var(--accent);
}
</style>
