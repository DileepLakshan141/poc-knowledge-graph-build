import type { StateRecord } from "./domain/stateRecord.js";

export function sortByTimestamp(records: StateRecord[]): StateRecord[] {
  return [...records].sort(
    (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp),
  );
}
