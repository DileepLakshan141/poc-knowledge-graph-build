import { z } from "zod";
import { EventTypeSchema } from "./eventType.js";

export const StateRecordSchema = z.looseObject({
  event: EventTypeSchema,
  workflow_id: z.string(),
  stage_id: z.string(),
  status: z.string(),
  gate_id: z.string().optional(),
  prev_entry_sha256: z.string().nullable(),
  action_by: z.string(),
  attestation_type: z.string(),
  approved_content_sha256: z.string(),
  timestamp: z.iso.datetime(),
  signature: z.string(),
  commit_sha: z.string().regex(/^[0-9a-f]{40}$/),
  upstream_content_sha256: z.record(z.string(), z.string()).optional(),
  local_override: z.boolean().optional(),
});

export type StateRecord = z.infer<typeof StateRecordSchema>;
