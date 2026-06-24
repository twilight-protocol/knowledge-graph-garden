import { ref, watch, type Ref } from "vue";
//自动持久化
export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  let stored: T | null = null;
  try {
    const item = localStorage.getItem(key);
    if (item) {
      stored = JSON.parse(item);
    }
  } catch (e) {
    console.warn(`读取LocalStorage失败: ${key}`, e);
  }
  const data = ref(stored !== null ? stored : defaultValue) as Ref<T>;
  watch(
    data,
    (newValue) => {
      try {
        localStorage.setItem(key, JSON.stringify(newValue));
      } catch (e) {
        console.warn(`写入LocalStorage失败: ${key}`, e);
      }
    },
    { deep: true },
  );
  return data;
}
