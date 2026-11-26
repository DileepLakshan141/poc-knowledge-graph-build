import { describe, it, expect } from "vitest";
import { decisionId } from "./ids.js";
import { aGateDecision } from "../testing/recordBuilder.js";

const feature = "feature__t2_knowledge-discovery";

describe("decisionId", () => {
  it("is deterministic", () => {
    const record = aGateDecision();
    expect(decisionId(feature, record)).toBe(decisionId(feature, record));
  });

  it("differs when the timestamp differs", () => {
    const a = aGateDecision({ timestamp: "2026-11-06T16:16:12.602Z" });
    const b = aGateDecision({ timestamp: "2026-11-06T16:16:12.603Z" });
    expect(decisionId(feature, a)).not.toBe(decisionId(feature, b));
  });

  it("uses the event name when there is no gate", () => {
    const init = aGateDecision({ event: "INIT", gate_id: undefined });
    expect(decisionId(feature, init)).toContain(":INIT:");
  });
});
