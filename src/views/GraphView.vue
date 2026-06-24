<template>
  <div class="view">
    <GraphCanvas ref="graphRef" />
    <GraphControls
      :is-running="graphRef?.isRunning ?? false"
      @reset="graphRef?.resetZoom()"
      @toggle-simulation="graphRef?.toggleSimulation()"
      @zoom-in="graphRef?.zoomIn()"
      @zoom-out="graphRef?.zoomOut()"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import GraphCanvas from "@/components/graph/GraphCanvas.vue";
import GraphControls from "@/components/graph/GraphControls.vue";

const graphRef = ref<InstanceType<typeof GraphCanvas>>();
</script>

<style scoped>
.view {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
