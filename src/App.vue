<template>
  <div class="app" :class="{ dark: uiStore.isDark }">
    <AppHeader />
    <div class="body">
      <AppSidebar />
      <main class="main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from "@/stores/uiStore";
import AppHeader from "@/components/common/AppHeader.vue";
import AppSidebar from "@/components/common/AppSidebar.vue";

const uiStore = useUIStore();
</script>

<style>
:root {
  /* 背景 */
  --bg-primary: #f7faf8;
  --bg-secondary: #ffffff;
  --bg-tertiary: #ecfdf5;
  --bg-hover: rgba(16, 185, 129, 0.06);

  /* 文字 */
  --text-primary: #134e4a;
  --text-secondary: #5b7c74;
  --text-muted: #94a8a0;

  /* 边框 */
  --border: #dce8e3;
  --border-light: rgba(16, 185, 129, 0.15);

  /* 主色调 - 翡翠绿 */
  --accent: #10b981;
  --accent-soft: #34d399;
  --accent-bg: rgba(16, 185, 129, 0.1);
  --accent-bg-hover: rgba(16, 185, 129, 0.15);

  /* 阴影 */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 30px rgba(0, 0, 0, 0.08);

  /* 圆角 */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;

  color-scheme: light;
  font-family:
    "Inter",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    sans-serif;
  font-size: 15px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app.dark {
  --bg-primary: #0b1714;
  --bg-secondary: #11231e;
  --bg-tertiary: #162e26;
  --bg-hover: rgba(52, 211, 153, 0.08);

  --text-primary: #d9ebe4;
  --text-secondary: #8aa89e;
  --text-muted: #5a7a6e;

  --border: rgba(138, 168, 158, 0.14);
  --border-light: rgba(52, 211, 153, 0.15);

  --accent: #34d399;
  --accent-soft: #6ee7b7;
  --accent-bg: rgba(52, 211, 153, 0.12);
  --accent-bg-hover: rgba(52, 211, 153, 0.18);

  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.25);
  --shadow-lg: 0 10px 30px rgba(0, 0, 0, 0.35);

  color-scheme: dark;
}

*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition:
    background 0.3s ease,
    color 0.3s ease;
}

.body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.main {
  flex: 1;
  overflow: hidden;
  background: var(--bg-primary);
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--text-muted);
  border-radius: 3px;
  opacity: 0.5;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

::selection {
  background: var(--accent-bg);
  color: var(--accent);
}

a {
  color: var(--accent);
  text-decoration: none;
  transition: color 0.2s;
}

a:hover {
  color: var(--accent-soft);
}

button {
  font-family: inherit;
}
</style>
