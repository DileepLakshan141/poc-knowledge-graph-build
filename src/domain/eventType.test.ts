import { describe, it, expect } from "vitest";
import { EventTypeSchema } from "./eventType.js";

describe("EventTypeSchema", () => {
  it("rejects an unknown event", () => {
    expect(EventTypeSchema.safeParse("GATE_DECISON").success).toBe(false);
    expect(EventTypeSchema.safeParse("GATE_DECISION").success).toBe(true);
  });
});
