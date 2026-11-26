import { describe, it, expect } from "vitest";
import { PropertyGraph, type GraphNode } from "./propertyGraph.js";
import { NodeLabel, RelType } from "./ontology.js";

const actor: GraphNode = {
  id: "Actor:synthetic-user@example.test",
  label: NodeLabel.Actor,
  properties: {},
};

describe("PropertyGraph", () => {
  it("stores and returns a node", () => {
    const graph = new PropertyGraph();
    graph.addNode(actor);
    expect(graph.getNode(actor.id)?.label).toBe("Actor");
    expect(graph.nodeCount).toBe(1);
  });

  it("refuses a duplicate id", () => {
    const graph = new PropertyGraph();
    graph.addNode(actor);
    expect(() => graph.addNode(actor)).toThrow("already exists");
  });
});

function aNode(label: NodeLabel, key: string): GraphNode {
  return { id: `${label}:${key}`, label, properties: {} };
}

describe("PropertyGraph edges", () => {
  it("adds an allowed edge", () => {
    const graph = new PropertyGraph();
    const decision = aNode(NodeLabel.Decision, "d1");
    const artifact = aNode(NodeLabel.Artifact, "a1");
    graph.addNode(decision);
    graph.addNode(artifact);
    graph.addEdge({
      from: decision.id,
      rel: RelType.Approved,
      to: artifact.id,
    });
    expect(graph.edgeCount).toBe(1);
  });

  it("rejects an edge with a missing endpoint", () => {
    const graph = new PropertyGraph();
    graph.addNode(aNode(NodeLabel.Decision, "d1"));
    expect(() =>
      graph.addEdge({
        from: "Decision:d1",
        rel: RelType.Approved,
        to: "Artifact:nope",
      }),
    ).toThrow("endpoint missing");
  });

  it("rejects an edge the ontology does not allow", () => {
    const graph = new PropertyGraph();
    const actor = aNode(NodeLabel.Actor, "u1");
    const stage = aNode(NodeLabel.Stage, "s1");
    graph.addNode(actor);
    graph.addNode(stage);
    expect(() =>
      graph.addEdge({ from: actor.id, rel: RelType.Approved, to: stage.id }),
    ).toThrow("not allowed by ontology");
  });
});

it("ensureNode returns the existing node instead of duplicating", () => {
  const graph = new PropertyGraph();
  const first = graph.ensureNode(actor);
  const second = graph.ensureNode(actor);
  expect(second).toBe(first);
  expect(graph.nodeCount).toBe(1);
});

it("ensureNode rejects the same id with a different label", () => {
  const graph = new PropertyGraph();
  graph.ensureNode(actor);
  expect(() =>
    graph.ensureNode({ id: actor.id, label: NodeLabel.Commit, properties: {} }),
  ).toThrow("already used");
});

it("ensureEdge does not duplicate an edge", () => {
  const graph = new PropertyGraph();
  const decision = aNode(NodeLabel.Decision, "d1");
  const artifact = aNode(NodeLabel.Artifact, "a1");
  graph.addNode(decision);
  graph.addNode(artifact);
  const edge = { from: decision.id, rel: RelType.Approved, to: artifact.id };
  graph.ensureEdge(edge);
  graph.ensureEdge(edge);
  expect(graph.edgeCount).toBe(1);
});

it("exposes nodes and edges without allowing changes to the graph", () => {
  const graph = new PropertyGraph();
  graph.addNode(actor);
  const nodes = graph.allNodes() as GraphNode[];
  nodes.pop();
  expect(graph.nodeCount).toBe(1);
  expect(graph.allNodes()).toHaveLength(1);
  expect(graph.allEdges()).toHaveLength(0);
});
