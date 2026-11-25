import { describe, it, expect } from "vitest";
import { StateRecordSchema } from "./stateRecord.js";
import { aGateDecision } from "../testing/recordBuilder.js";

describe("StateRecordSchema", () => {
  it("accepts a valid gate decision", () => {
    const result = StateRecordSchema.safeParse(aGateDecision());
    expect(result.success).toBe(true);
  });

  it("reports which field is missing", () => {
    const result = StateRecordSchema.safeParse({
      ...aGateDecision(),
      stage_id: undefined,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["stage_id"]);
    }
  });

  it("accepts INIT (no gate_id, null prev hash)", () => {
    const result = StateRecordSchema.safeParse(
      aGateDecision({
        event: "INIT",
        gate_id: undefined,
        prev_entry_sha256: null,
        approved_content_sha256: "",
      }),
    );
    expect(result.success).toBe(true);
  });

  it("rejects a record with no prev_entry_sha256 key", () => {
    const result = StateRecordSchema.safeParse({
      ...aGateDecision(),
      prev_entry_sha256: undefined,
    });
    expect(result.success).toBe(false);
  });

  it("rejects a malformed commit_sha", () => {
    const result = StateRecordSchema.safeParse(
      aGateDecision({ commit_sha: "not-a-sha" }),
    );
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["commit_sha"]);
    }
  });

  it("rejects a malformed timestamp", () => {
    const result = StateRecordSchema.safeParse(
      aGateDecision({ timestamp: "yesterday" }),
    );
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["timestamp"]);
    }
  });

  it("accepts upstream hashes and a local override", () => {
    const result = StateRecordSchema.safeParse(
      aGateDecision({
        upstream_content_sha256: {
          intake:
            "acfefb9646cb78a9c888fdd0c418cccba84d9210d3b9fbbe3f42ac28a9a1c69b",
        },
        local_override: true,
      }),
    );
    expect(result.success).toBe(true);
  });

  it("rejects a non-boolean local_override", () => {
    const result = StateRecordSchema.safeParse({
      ...aGateDecision(),
      local_override: "true",
    });
    expect(result.success).toBe(false);
  });
});
