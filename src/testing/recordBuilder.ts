import type { StateRecord } from "../domain/stateRecord.js";

export function aGateDecision(
  overrides: Partial<StateRecord> = {},
): StateRecord {
  return {
    event: "GATE_DECISION",
    workflow_id: "enterprise-ai-dlc",
    stage_id: "intake",
    status: "APPROVED",
    gate_id: "intake-accepted",
    prev_entry_sha256:
      "624c8fae30f16f9d0ebd94bc48a1aae9b21f55e699e21e16ec0012706d1c6078",
    action_by: "synthetic-user@example.test",
    attestation_type: "LOCAL_OPTIMISTIC",
    approved_content_sha256:
      "acfefb9646cb78a9c888fdd0c418cccba84d9210d3b9fbbe3f42ac28a9a1c69b",
    timestamp: "2026-11-06T16:16:12.602Z",
    signature: "SYNTHETIC_SIGNATURE_02",
    commit_sha: "134ab341bd2463daba88aa40c92b9700b5d26c04",
    ...overrides,
  };
}
