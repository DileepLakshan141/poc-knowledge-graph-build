import { loadFolderSplit } from "./loadFolder.js";
import { sortByTimestamp } from "./sortRecords.js";

async function main(): Promise<void> {
  const { records, failures } = await loadFolderSplit(
    "fixtures/feature__t2_knowledge-discovery",
  );
  console.log("records:", records.length, "failures:", failures.length);
  for (const r of sortByTimestamp(records)) {
    console.log(
      r.stage_id,
      r.gate_id ?? "(none)",
      r.local_override ?? "absent",
      Object.keys(r.upstream_content_sha256 ?? {}),
    );
    // console.log(r.timestamp, r.stage_id, r.gate_id ?? "(none)");
  }
}

main();
