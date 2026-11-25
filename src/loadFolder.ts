import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { loadRecord, type LoadResult } from "./loadRecords.js";
import { StateRecord } from "./domain/stateRecord.js";

export type FolderLoad = {
  records: StateRecord[];
  failures: { file: string; reason: string }[];
};

export async function loadFolder(folder: string): Promise<LoadResult[]> {
  const names = await readdir(folder);
  const jsonNames = names.filter((name) => name.endsWith(".json"));
  return Promise.all(jsonNames.map((name) => loadRecord(join(folder, name))));
}

export async function loadFolderSplit(folder: string): Promise<FolderLoad> {
  const results = await loadFolder(folder);
  const records: StateRecord[] = [];
  const failures: { file: string; reason: string }[] = [];

  for (const result of results) {
    if (result.ok) {
      records.push(result.record);
    } else {
      failures.push({ file: result.file, reason: result.reason });
    }
  }
  return { records, failures };
}
