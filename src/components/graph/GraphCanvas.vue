<template>
  <div ref="containerRef" class="graph-canvas">
    <svg ref="svgRef" class="graph-svg"></svg>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import * as d3 from "d3";
import { useRouter } from "vue-router";
import { useGraphData } from "@/composables/useGraphData";
import type { GraphNode } from "@/types";

const containerRef = ref<HTMLDivElement>();
const svgRef = ref<SVGSVGElement>();
const router = useRouter();
const { nodes, links } = useGraphData();

let simulation: d3.Simulation<GraphNode, undefined> | null = null;
let svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | null = null;
let g: d3.Selection<SVGGElement, unknown, null, undefined> | null = null;
let zoomBehavior: d3.ZoomBehavior<SVGSVGElement, unknown> | null = null;
const isRunning = ref(true);

const initGraph = () => {
  if (!svgRef.value || !containerRef.value) return;
  const width = containerRef.value.clientWidth;
  const height = containerRef.value.clientHeight;

  const style = getComputedStyle(document.documentElement);
  const linkColor = style.getPropertyValue("--text-muted").trim() || "#94a8a0";
  const textColor =
    style.getPropertyValue("--text-primary").trim() || "#134e4a";

  d3.select(svgRef.value).selectAll("*").remove();

  svg = d3
    .select(svgRef.value)
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height]);

  zoomBehavior = d3
    .zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.1, 4])
    .on("zoom", (event) => {
      g?.attr("transform", event.transform);
    });

  svg.call(zoomBehavior);

  g = svg.append("g");

  const linkData = links.value.map((l) => ({ ...l }));
  const nodeData = nodes.value.map((n) => ({ ...n }));

  const link = g
    .append("g")
    .attr("stroke", linkColor)
    .attr("stroke-opacity", 0.35)
    .selectAll("line")
    .data(linkData)
    .join("line")
    .attr("stroke-width", 1.5);

  const node = g
    .append("g")
    .selectAll("g")
    .data(nodeData)
    .join("g")
    .style("cursor", "pointer")
    .call(
      (d3.drag() as any)
        .on(
          "start",
          (
            event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>,
            d: GraphNode,
          ) => {
            if (!event.active) simulation?.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
            (d as any).__wasDragged = false;
          },
        )
        .on(
          "drag",
          (
            event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>,
            d: GraphNode,
          ) => {
            d.fx = event.x;
            d.fy = event.y;
            (d as any).__wasDragged = true;
          },
        )
        .on(
          "end",
          (
            event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>,
            d: GraphNode,
          ) => {
            if (!event.active) simulation?.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          },
        ),
    )
    .on("click", (_event, d) => {
      if ((d as any).__wasDragged) return;
      router.push(`/note/${d.id}`);
    });

  node
    .append("circle")
    .attr("r", (d) => d.radius)
    .attr("fill", (d) => d.color)
    .attr("stroke", "var(--bg-secondary)")
    .attr("stroke-width", 2)
    .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.15))");

  node
    .append("text")
    .text((d) => d.title)
    .attr("text-anchor", "middle")
    .attr("dy", (d) => d.radius + 16)
    .attr("font-size", 12)
    .attr("fill", textColor)
    .attr("font-weight", 500)
    .style("pointer-events", "none");

  simulation = d3
    .forceSimulation<GraphNode>(nodeData)
    .force(
      "link",
      d3
        .forceLink<GraphNode, any>(linkData)
        .id((d: any) => d.id)
        .distance(120),
    )
    .force("charge", d3.forceManyBody().strength(-400))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force(
      "collision",
      d3.forceCollide<GraphNode>().radius((d) => d.radius + 10),
    )
    .on("tick", () => {
      link
        .attr("x1", (d: any) => (d.source as GraphNode).x!)
        .attr("y1", (d: any) => (d.source as GraphNode).y!)
        .attr("x2", (d: any) => (d.target as GraphNode).x!)
        .attr("y2", (d: any) => (d.target as GraphNode).y!);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });
};

const resetZoom = () => {
  if (!svg || !zoomBehavior) return;
  svg.transition().duration(750).call(zoomBehavior.transform, d3.zoomIdentity);
};

const toggleSimulation = () => {
  if (!simulation) return;
  isRunning.value = !isRunning.value;
  if (isRunning.value) {
    simulation.alpha(0.3).restart();
  } else {
    simulation.stop();
  }
};

const zoomIn = () => {
  if (!svg || !zoomBehavior) return;
  svg.transition().duration(300).call(zoomBehavior.scaleBy, 1.3);
};

const zoomOut = () => {
  if (!svg || !zoomBehavior) return;
  svg.transition().duration(300).call(zoomBehavior.scaleBy, 0.7);
};

defineExpose({
  resetZoom,
  toggleSimulation,
  zoomIn,
  zoomOut,
  isRunning,
});

watch(
  [nodes, links],
  () => {
    nextTick(() => initGraph());
  },
  { deep: true },
);

onMounted(() => {
  initGraph();
  window.addEventListener("resize", initGraph);
});

onUnmounted(() => {
  simulation?.stop();
  window.removeEventListener("resize", initGraph);
});
</script>

<style scoped>
.graph-canvas {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.graph-svg {
  width: 100%;
  height: 100%;
}
</style>
