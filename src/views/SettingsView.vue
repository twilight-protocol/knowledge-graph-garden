<template>
  <div class="view">
    <h2 class="title">⚙️ 设置</h2>

    <section>
      <h3>数据管理</h3>
      <div class="row">
        <div class="info">
          <p class="label">导出笔记</p>
          <p class="desc">将所有笔记导出为 JSON 文件</p>
        </div>
        <button class="btn" @click="exportData">📥 导出</button>
      </div>
      <div class="row">
        <div class="info">
          <p class="label">导入笔记</p>
          <p class="desc">从 JSON 文件恢复笔记</p>
        </div>
        <label class="btn">
          📤 导入
          <input type="file" accept=".json" @change="importData" hidden />
        </label>
      </div>
    </section>

    <section>
      <h3>外观</h3>
      <div class="row">
        <div class="info">
          <p class="label">主题</p>
          <p class="desc">选择界面配色方案</p>
        </div>
        <select v-model="uiStore.isDark" class="select">
          <option :value="false">☀️ 亮色</option>
          <option :value="true">🌙 暗色</option>
        </select>
      </div>
    </section>

    <section class="danger">
      <h3>危险区域</h3>
      <div class="row">
        <div class="info">
          <p class="label">清空所有数据</p>
          <p class="desc">此操作不可恢复，所有笔记将被删除</p>
        </div>
        <button class="btn danger" @click="confirmClear">🗑 清空</button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useNoteStore } from "@/stores/noteStore";
import { useUIStore } from "@/stores/uiStore";

const noteStore = useNoteStore();
const uiStore = useUIStore();

const exportData = () => {
  const data = {
    version: "1.0",
    exportAt: Date.now(),
    notes: noteStore.notes,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `knowledge-garden-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

const importData = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result as string);
      if (!Array.isArray(data.notes)) {
        alert("文件格式错误：缺少 notes 数组");
        return;
      }

      // 校验并修复每条笔记的字段
      const now = Date.now();
      const validated: typeof noteStore.notes = data.notes
        .filter((n: any) => n && typeof n.id === "string" && n.id)
        .map((n: any) => ({
          id: n.id,
          title: typeof n.title === "string" ? n.title : "无标题",
          content: typeof n.content === "string" ? n.content : "",
          tags: Array.isArray(n.tags) ? n.tags : [],
          links: Array.isArray(n.links)
            ? n.links.filter((l: any) => typeof l === "string")
            : [],
          backlinks: Array.isArray(n.backlinks)
            ? n.backlinks.filter((b: any) => typeof b === "string")
            : [],
          createdAt: typeof n.createdAt === "number" ? n.createdAt : now,
          updatedAt: typeof n.updatedAt === "number" ? n.updatedAt : now,
        }));

      if (validated.length === 0) {
        alert("文件中没有有效的笔记数据");
        return;
      }

      if (
        confirm(
          `确定导入 ${validated.length} 条笔记？当前 ${noteStore.notes.length} 条笔记将被覆盖。`,
        )
      ) {
        noteStore.notes = validated;
        noteStore.currentNoteId = null;
      }
    } catch {
      alert("文件格式错误，无法解析 JSON");
    }
  };
  reader.readAsText(file);
  (e.target as HTMLInputElement).value = "";
};

const confirmClear = () => {
  if (confirm("确定要清空所有笔记吗？此操作不可恢复！")) {
    noteStore.notes = [];
    noteStore.currentNoteId = null;
  }
};
</script>

<style scoped>
.view {
  max-width: 640px;
  margin: 0 auto;
  padding: 32px 24px;
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 24px;
}

section {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: var(--shadow-sm);
}

section h3 {
  font-size: 14px;
  font-weight: 600;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
}

.danger h3 {
  color: #ef4444;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-light);
}

.row:last-child {
  border-bottom: none;
}

.label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.desc {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
}

.btn {
  padding: 8px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-bg);
}

.btn.danger {
  border-color: #fca5a5;
  color: #ef4444;
}

.btn.danger:hover {
  background: #fef2f2;
}

.select {
  padding: 8px 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 13px;
  cursor: pointer;
  outline: none;
}

.select:focus {
  border-color: var(--accent);
}
</style>
