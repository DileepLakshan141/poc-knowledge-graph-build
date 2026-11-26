import { describe, it, expect } from "vitest";
import { LadybugStore } from "./ladybugStore.js";
import { buildGraph } from "../graph/buildGraph.js";
import { aGateDecision } from "../testing/recordBuilder.js";

describe("LadybugStore", () => {
  it("creates the schema in an empty in-memory database", async () => {
    const store = await LadybugStore.create();
    const decisions = await store.query(
      "MATCH (d:Decision) RETURN count(d) AS n",
    );
    const commits = await store.query("MATCH (c:Commit) RETURN count(c) AS n");
    expect(Number(decisions[0]?.["n"])).toBe(0);
    expect(Number(commits[0]?.["n"])).toBe(0);
  });

  it("loads a staging graph and keeps the counts", async () => {
    const graph = buildGraph("feature__test", [aGateDecision()]);
    const store = await LadybugStore.create();
    await store.load(graph);
    const nodes = await store.query("MATCH (n) RETURN count(n) AS total");
    const edges = await store.query(
      "MATCH ()-[r]->() RETURN count(r) AS total",
    );
    expect(Number(nodes[0]?.["total"])).toBe(graph.nodeCount);
    expect(Number(edges[0]?.["total"])).toBe(graph.edgeCount);
  });
});
