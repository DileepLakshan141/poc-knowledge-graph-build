import { basename } from "node:path";
import { describe, it, expect } from "vitest";
import { loadFolderSplit } from "./loadFolder.js";
import { buildGraph } from "./graph/buildGraph.js";
import { LadybugStore } from "./store/ladybugStore.js";
import { QUERIES } from "./queries.js";

const folder = "fixtures/feature__t2_knowledge-discovery";

async function run(id: string): Promise<Record<string, unknown>[]> {
  const { records } = await loadFolderSplit(folder);
  const store = await LadybugStore.create();
  await store.load(buildGraph(basename(folder), records));
  const query = QUERIES.find((q) => q.id === id);
  if (!query) {
    throw new Error(`Unknown query: ${id}`);
  }
  return store.query(query.cypher);
}

describe("named queries on the fixture", () => {
  it("finds the approvals that go stale when the code changes", async () => {
    const rows = await run("stale-if-code-changes");
    expect(rows.map((r) => r["gate"])).toEqual([
      "Gate:enterprise-ai-dlc:verification:tests-passed",
      "Gate:enterprise-ai-dlc:security review:security-approved",
      "Gate:enterprise-ai-dlc:release:release-approved",
    ]);
  });

  it("finds the overridden approvals", async () => {
    const rows = await run("overridden-approvals");
    expect(rows.map((r) => r["gate"])).toEqual([
      "Gate:enterprise-ai-dlc:context-spec:spec-approved",
      "Gate:enterprise-ai-dlc:security review:security-approved",
    ]);
  });
});
