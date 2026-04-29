"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { MindMapGraph, MindMapNode } from "@/types";
import { Network, type Node, type Edge, type IdType } from "vis-network";
import { DataSet } from "vis-data";
import { getImportanceColor } from "@/components/cards/ImportanceBadge";

interface MindMapCanvasProps {
  graph: MindMapGraph;
}

const groupColors: Record<string, string> = {};

function getGroupColor(group: string): string {
  if (!groupColors[group]) {
    const hue =
      Object.keys(groupColors).length * 137.5 % 360;
    groupColors[group] = `hsl(${hue}, 55%, 65%)`;
  }
  return groupColors[group];
}

export function MindMapCanvas({ graph }: MindMapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);
  const router = useRouter();

  const initNetwork = useCallback(() => {
    if (!containerRef.current || graph.nodes.length === 0) return;

    // Group nodes into categories
    const groups = new Map<string, string>();
    graph.nodes.forEach((n) => {
      if (!groups.has(n.group)) {
        groups.set(n.group, n.group);
      }
    });

    const nodes: Node[] = graph.nodes.map((node) => {
      const color = getImportanceColor(node.value);
      return {
        id: node.id,
        label: node.label,
        value: node.value,
        group: node.group,
        color: {
          background: color,
          border: color,
          highlight: { background: color, border: "#333" },
          hover: { background: color, border: "#333" },
        },
        font: {
          size: 12 + node.value * 2,
          face: "Geist, sans-serif",
          color: "#1a1a1a",
          background: "rgba(255,255,255,0.85)",
          strokeWidth: 2,
          strokeColor: "rgba(255,255,255,0.85)",
        },
        borderWidth: 2,
        borderWidthSelected: 4,
        shape: "dot",
        size: 16 + node.value * 6,
        scaling: {
          min: 10,
          max: 50,
          label: { enabled: true, min: 10, max: 20 },
        },
      };
    });

    const edges: Edge[] = graph.edges.map((edge, index) => ({
      id: `e${index}`,
      from: edge.from,
      to: edge.to,
      label: edge.label || "",
      dashes: edge.dashes || false,
      color: { color: edge.dashes ? "#c0c0c0" : "#888888" },
      font: { size: 10, color: "#666", background: "white" },
      arrows: { to: { enabled: true, scaleFactor: 0.5 } },
      smooth: { enabled: true, type: "continuous", roundness: 0.5 },
    }));

    const nodeDataSet = new DataSet<Node>(nodes);
    const edgeDataSet = new DataSet<Edge>(edges);

    const options = {
      physics: {
        enabled: true,
        solver: "forceAtlas2Based" as const,
        forceAtlas2Based: {
          gravitationalConstant: -50,
          centralGravity: 0.01,
          springLength: 200,
          springConstant: 0.08,
          damping: 0.4,
        },
        stabilization: {
          enabled: true,
          iterations: 200,
        },
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        navigationButtons: true,
        keyboard: true,
      },
      layout: {
        improvedLayout: true,
      },
    };

    const network = new Network(containerRef.current, { nodes: nodeDataSet, edges: edgeDataSet }, options);

    network.on("click", (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0] as string;
        router.push(`/cards/${nodeId}`);
      }
    });

    networkRef.current = network;
  }, [graph, router]);

  useEffect(() => {
    initNetwork();
    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [initNetwork]);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-xl border bg-white"
      style={{ height: "calc(100vh - 200px)", minHeight: 500 }}
    />
  );
}
