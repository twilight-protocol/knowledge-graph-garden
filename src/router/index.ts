import { createRouter, createWebHashHistory } from "vue-router";
import EditorView from "@/views/EditorView.vue";
import GraphView from "@/views/GraphView.vue";
import SettingsView from "@/views/SettingsView.vue";

const routes = [
  {
    path: "/",
    name: "Editor",
    component: EditorView,
  },
  {
    path: "/note/:id",
    name: "Note",
    component: EditorView,
  },
  {
    path: "/graph",
    name: "Graph",
    component: GraphView,
  },
  {
    path: "/settings",
    name: "Settings",
    component: SettingsView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
