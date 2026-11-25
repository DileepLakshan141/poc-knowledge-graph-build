import { describe, it, expect } from "vitest";
import { loadRecord } from "./loadRecords.js";

describe("loadRecord", () => {
  it("fails with a reason when the file does not exist", async () => {
    const result = await loadRecord("fixtures/does-not-exist.json");
    expect(result.ok).toBe(false);
  });
});
