import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useUIStore = defineStore("ui", () => {
  const isDark = ref(localStorage.getItem("kg-theme") === "dark");

  const toggleTheme = () => {
    isDark.value = !isDark.value;
  };

  watch(isDark, (val) => {
    localStorage.setItem("kg-theme", val ? "dark" : "light");
  });

  return { isDark, toggleTheme };
});
