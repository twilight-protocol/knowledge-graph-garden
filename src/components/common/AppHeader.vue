<template>
  <header class="header">
    <div class="left">
      <h1 class="logo">🌿 知识花园</h1>
      <nav class="nav-links">
        <router-link to="/" class="nav-link" active-class="active"
          >📝 笔记</router-link
        >
        <router-link to="/graph" class="nav-link" active-class="active"
          >🕸️ 图谱</router-link
        >
        <router-link to="/settings" class="nav-link" active-class="active"
          >⚙️ 设置</router-link
        >
      </nav>
    </div>
    <div class="right">
      <button
        class="theme-btn"
        @click="uiStore.toggleTheme"
        :title="uiStore.isDark ? '切换亮色' : '切换暗色'"
      >
        {{ uiStore.isDark ? "☀️" : "🌙" }}
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useUIStore } from "@/stores/uiStore";
const uiStore = useUIStore();
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 56px;
  background: var(--bg-secondary);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  z-index: 100;
}

.left {
  display: flex;
  align-items: center;
  gap: 32px;
}

.logo {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.nav-links {
  display: flex;
  gap: 4px;
}

.nav-link {
  padding: 6px 12px;
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-link:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.nav-link.active,
.nav-link:global(.router-link-active) {
  color: var(--accent);
  background: var(--accent-bg);
}

.theme-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  transition: background 0.2s;
}

.theme-btn:hover {
  background: var(--bg-hover);
}
</style>
