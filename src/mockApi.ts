// src/mockApi.ts

import type { Edge, Node } from "reactflow";
import type { WorkflowNodeData, AutomationAction } from "./workflowTypes";

// mock automation actions
const mockActions: AutomationAction[] = [
  {
    id: "sendEmail",
    name: "Send Email",
    params: ["to", "subject", "body"],
  },
  {
    id: "generateDocument",
    name: "Generate Document",
    params: ["template", "output"],
  },
  {
    id: "notifySlack",
    name: "Notify Slack",
    params: ["channel", "message"],
  },
];

export function fetchAutomationActions(): Promise<AutomationAction[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockActions), 300);
  });
}

// ------------------------------------------------------
// Simulation with cycle detection
// ------------------------------------------------------

export async function simulateWorkflow(
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): Promise<string[]> {
  const log: string[] = [];

  // build adjacency list
  const nextMap: Record<string, string[]> = {};
  edges.forEach((e) => {
    if (!nextMap[e.source]) nextMap[e.source] = [];
    nextMap[e.source].push(e.target);
  });

  // set for detecting revisits (cycles)
  const visited = new Set<string>();

  // find start node
  const startNode = nodes.find((n) => n.data.type === "start");
  if (!startNode) {
    log.push("❌ No Start node found.");
    return log;
  }

  const queue: string[] = [startNode.id];
  let step = 1;

  while (queue.length > 0) {
    const current = queue.shift()!;

    // ❗ cycle detection here
    if (visited.has(current)) {
      log.push(`❌ Cycle detected: node "${current}" visited twice.`);
      log.push("Fix the loop and try again.");
      return log;
    }
    visited.add(current);

    const node = nodes.find((n) => n.id === current);
    if (!node) continue;

    // human-friendly info
    const kind = node.data.type.toUpperCase();
    const label = node.data.label || kind;

    // metadata preview
    let meta = "";
    if (node.data.type === "start") {
      const pairs = node.data.metadata
        .filter((m) => m.key || m.value)
        .map((m) => `${m.key}:${m.value}`)
        .join(", ");
      if (pairs) meta = ` | metadata: ${pairs}`;
    }

    log.push(`Step ${step++}: [${kind}] ${label}${meta}`);

    // enqueue next nodes
    for (const next of nextMap[current] || []) {
      queue.push(next);
    }
  }

  // finish log
  log.push("✔ Workflow simulation completed.");
  return log;
}
