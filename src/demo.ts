import { basename } from "node:path";
import { loadFolderSplit } from "./loadFolder.js";
import { buildGraph } from "./graph/buildGraph.js";
import { LadybugStore } from "./store/ladybugStore.js";
import { QUERIES } from "./queries.js";

async function main(): Promise<void> {
  const folder = "fixtures/feature__t2_knowledge-discovery";
  const { records } = await loadFolderSplit(folder);
  const store = await LadybugStore.create();
  await store.load(buildGraph(basename(folder), records));

  for (const query of QUERIES) {
    console.log(`\n${query.title}`);
    console.table(await store.query(query.cypher));
  }
}

main();
