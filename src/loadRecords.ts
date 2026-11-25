import { readFile } from "node:fs/promises";
import { StateRecordSchema, type StateRecord } from "./domain/stateRecord.js";

export type LoadResult =
  | { ok: true; record: StateRecord }
  | { ok: false; file: string; reason: string };

export async function loadRecord(file: string): Promise<LoadResult> {
  try {
    const text = await readFile(file, "utf-8");
    const parsed = StateRecordSchema.safeParse(JSON.parse(text));
    if (!parsed.success) {
      const reason = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
      return { ok: false, file, reason };
    }
    return { ok: true, record: parsed.data };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return { ok: false, file, reason };
  }
}
