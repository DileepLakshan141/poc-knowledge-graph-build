import type { StateRecord } from "../domain/stateRecord.js";
import { sortByTimestamp } from "../sortRecords.js";
import { addDecision, addReliance } from "./graphBuilder.js";
import { PropertyGraph } from "./propertyGraph.js";

export function buildGraph(
  feature: string,
  records: StateRecord[],
): PropertyGraph {
  const graph = new PropertyGraph();
  for (const record of sortByTimestamp(records)) {
    addDecision(graph, feature, record);
  }
  addReliance(graph, feature, records);
  return graph;
}
