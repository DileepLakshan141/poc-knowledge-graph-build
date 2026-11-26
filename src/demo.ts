import { basename } from "node:path";
import { loadFolderSplit } from "./loadFolder.js";
import { buildGraph } from "./graph/buildGraph.js";
import { LadybugStore } from "./store/ladybugStore.js";

const SECURITY_APPROVAL = `
MATCH (g:\`Gate\` {id: 'Gate:enterprise-ai-dlc:security review:security-approved'})
      <-[:\`DECIDES\`]-(d:\`Decision\`)-[:\`DECIDED_BY\`]->(a:\`Actor\`)
RETURN a.id AS actor, d.status AS status, d.timestamp AS at, d.local_override AS override
`;

async function main(): Promise<void> {
  const folder = "fixtures/feature__t2_knowledge-discovery";
  const { records } = await loadFolderSplit(folder);
  const store = await LadybugStore.create();
  await store.load(buildGraph(basename(folder), records));

  console.log(await store.query(SECURITY_APPROVAL));
}

main();
