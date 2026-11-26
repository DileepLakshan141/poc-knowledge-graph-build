import { basename } from "node:path";
import { loadFolderSplit } from "./loadFolder.js";
import { buildGraph } from "./graph/buildGraph.js";
import { LadybugStore } from "./store/ladybugStore.js";

async function main(): Promise<void> {
  const folder = "fixtures/feature__t2_knowledge-discovery";
  const { records, failures } = await loadFolderSplit(folder);
  const graph = buildGraph(basename(folder), records);
  const store = await LadybugStore.create();
  await store.load(graph);
  const nodes = await store.query("MATCH (n) RETURN count(n) AS total");
  const edges = await store.query("MATCH ()-[r]->() RETURN count(r) AS total");
  console.log(
    "staging:",
    graph.nodeCount,
    graph.edgeCount,
    "engine:",
    nodes[0]?.["total"],
    edges[0]?.["total"],
  );
}

main();
