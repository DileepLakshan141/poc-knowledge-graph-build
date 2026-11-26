import { describe, it, expect } from "vitest";
import { addDecision } from "./graphBuilder.js";
import { PropertyGraph } from "./propertyGraph.js";
import { aGateDecision } from "../testing/recordBuilder.js";

const feature = "feature__t2_knowledge-discovery";

describe("addDecision", () => {
  it("adds a decision, its actor and one edge", () => {
    const graph = new PropertyGraph();
    addDecision(graph, feature, aGateDecision());
    expect(graph.nodeCount).toBe(4);
    expect(graph.edgeCount).toBe(4);
  });

  it("adds an INIT record without a gate", () => {
    const graph = new PropertyGraph();
    addDecision(
      graph,
      feature,
      aGateDecision({ event: "INIT", gate_id: undefined }),
    );
    expect(graph.nodeCount).toBe(3);
    expect(graph.edgeCount).toBe(2);
  });

  it("reuses the actor across decisions", () => {
    const graph = new PropertyGraph();
    addDecision(
      graph,
      feature,
      aGateDecision({ timestamp: "2026-11-06T16:16:12.602Z" }),
    );
    addDecision(
      graph,
      feature,
      aGateDecision({ timestamp: "2026-11-06T17:00:00.000Z" }),
    );
    expect(graph.nodeCount).toBe(5);
    expect(graph.edgeCount).toBe(7);
  });

  it("fails loudly on the same decision twice", () => {
    const graph = new PropertyGraph();
    addDecision(graph, feature, aGateDecision());
    expect(() => addDecision(graph, feature, aGateDecision())).toThrow(
      "already exists",
    );
  });
});
