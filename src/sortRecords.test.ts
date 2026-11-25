import { describe, it, expect } from "vitest";
import { sortByTimestamp } from "./sortRecords.js";
import { aGateDecision } from "./testing/recordBuilder.js";

describe("sortByTimestamp", () => {
  const late = aGateDecision({ timestamp: "2026-11-08T15:30:00.000Z" });
  const early = aGateDecision({ timestamp: "2026-11-06T15:16:12.602Z" });
  const middle = aGateDecision({ timestamp: "2026-11-07T09:12:11.300Z" });

  it("orders records oldest first", () => {
    expect(sortByTimestamp([late, early, middle])).toEqual([
      early,
      middle,
      late,
    ]);
  });

  it("does not change the input array", () => {
    const input = [late, early, middle];
    sortByTimestamp(input);
    expect(input).toEqual([late, early, middle]);
  });
});
