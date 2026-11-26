import { describe, it, expect } from "vitest";
import { addDecision } from "./graphBuilder.js";
import { PropertyGraph } from "./propertyGraph.js";
import { aGateDecision } from "../testing/recordBuilder.js";
import { decisionId } from "./ids.js";

const feature = "feature__t2_knowledge-discovery";

describe("addDecision", () => {
  it("adds a decision, its actor and one edge", () => {
    const graph = new PropertyGraph();
    addDecision(graph, feature, aGateDecision());
    expect(graph.nodeCount).toBe(6);
    expect(graph.edgeCount).toBe(6);
  });

  it("adds an INIT record without a gate", () => {
    const graph = new PropertyGraph();
    addDecision(
      graph,
      feature,
      aGateDecision({
        event: "INIT",
        gate_id: undefined,
        approved_content_sha256: "",
      }),
    );
    expect(graph.nodeCount).toBe(4);
    expect(graph.edgeCount).toBe(3);
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
    expect(graph.nodeCount).toBe(7);
    expect(graph.edgeCount).toBe(11);
  });

  it("fails loudly on the same decision twice", () => {
    const graph = new PropertyGraph();
    addDecision(graph, feature, aGateDecision());
    expect(() => addDecision(graph, feature, aGateDecision())).toThrow(
      "already exists",
    );
  });

  it("creates no artifact for an empty approved hash", () => {
    const graph = new PropertyGraph();
    addDecision(graph, feature, aGateDecision({ approved_content_sha256: "" }));
    expect(graph.getNode("Artifact:")).toBeUndefined();
  });

  it("links a decision to the artifacts it depends on", () => {
    const graph = new PropertyGraph();
    addDecision(
      graph,
      feature,
      aGateDecision({ upstream_content_sha256: { intake: "abc123" } }),
    );
    expect(graph.getNode("Artifact:abc123")).toBeDefined();
  });

  it("keeps local_override as true, false or null", () => {
    const cases = [
      { value: true, expected: true },
      { value: false, expected: false },
      { value: undefined, expected: null },
    ];
    for (const { value, expected } of cases) {
      const graph = new PropertyGraph();
      const record = { ...aGateDecision(), local_override: value };
      addDecision(graph, feature, record);
      const node = graph.getNode(decisionId(feature, record));
      expect(node?.properties["local_override"]).toBe(expected);
    }
  });
});
