import { basename } from "node:path";
import { loadFolderSplit } from "./loadFolder.js";
import { buildGraph } from "./graph/buildGraph.js";

async function main(): Promise<void> {
  const folder = "fixtures/feature__t2_knowledge-discovery";
  const { records, failures } = await loadFolderSplit(folder);
  const graph = buildGraph(basename(folder), records);
  console.log(
    "failures:",
    failures.length,
    "nodes:",
    graph.nodeCount,
    "edges:",
    graph.edgeCount,
  );
}

main();
