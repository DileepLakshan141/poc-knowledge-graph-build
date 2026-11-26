import type { StateRecord } from "../domain/stateRecord.js";
import { NodeLabel } from "./ontology.js";

type DecisionKeyFields = Pick<
  StateRecord,
  "stage_id" | "gate_id" | "event" | "timestamp"
>;

export function decisionId(feature: string, record: DecisionKeyFields): string {
  const gate = record.gate_id ?? record.event;
  return `${NodeLabel.Decision}:${feature}:${record.stage_id}:${gate}:${record.timestamp}`;
}
