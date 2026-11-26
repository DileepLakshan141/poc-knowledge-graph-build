import type { StateRecord } from "../domain/stateRecord.js";
import { decisionId } from "./ids.js";
import { NodeLabel, RelType } from "./ontology.js";
import type { GraphNode, PropertyGraph } from "./propertyGraph.js";

export function addDecision(
  graph: PropertyGraph,
  feature: string,
  record: StateRecord,
): void {
  const decision: GraphNode = {
    id: decisionId(feature, record),
    label: NodeLabel.Decision,
    properties: { status: record.status, timestamp: record.timestamp },
  };
  graph.addNode(decision);

  const actor = graph.ensureNode({
    id: `${NodeLabel.Actor}:${record.action_by}`,
    label: NodeLabel.Actor,
    properties: {},
  });

  graph.addEdge({ from: decision.id, rel: RelType.DecidedBy, to: actor.id });
}
