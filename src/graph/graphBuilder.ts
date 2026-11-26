import type { StateRecord } from "../domain/stateRecord.js";
import { artifactId, commitId, decisionId, gateId, stageId } from "./ids.js";
import { NodeLabel, RelType } from "./ontology.js";
import type { GraphNode, PropertyGraph } from "./propertyGraph.js";

function addActor(
  graph: PropertyGraph,
  decision: GraphNode,
  record: StateRecord,
): void {
  const actor = graph.ensureNode({
    id: `${NodeLabel.Actor}:${record.action_by}`,
    label: NodeLabel.Actor,
    properties: {},
  });
  graph.addEdge({ from: decision.id, rel: RelType.DecidedBy, to: actor.id });
}

function addCommit(
  graph: PropertyGraph,
  decision: GraphNode,
  record: StateRecord,
): void {
  const commit = graph.ensureNode({
    id: commitId(record.commit_sha),
    label: NodeLabel.Commit,
    properties: {},
  });
  graph.addEdge({ from: decision.id, rel: RelType.AtCommit, to: commit.id });
}

function ensureArtifact(graph: PropertyGraph, hash: string): GraphNode {
  return graph.ensureNode({
    id: artifactId(hash),
    label: NodeLabel.Artifact,
    properties: {},
  });
}

function addApproved(
  graph: PropertyGraph,
  decision: GraphNode,
  record: StateRecord,
): void {
  if (record.approved_content_sha256 === "") {
    return;
  }
  const artifact = ensureArtifact(graph, record.approved_content_sha256);
  graph.addEdge({ from: decision.id, rel: RelType.Approved, to: artifact.id });
}

function addDependencies(
  graph: PropertyGraph,
  decision: GraphNode,
  record: StateRecord,
): void {
  const hashes = Object.values(record.upstream_content_sha256 ?? {});
  for (const hash of hashes) {
    const artifact = ensureArtifact(graph, hash);
    graph.ensureEdge({
      from: decision.id,
      rel: RelType.DependsOn,
      to: artifact.id,
    });
  }
}

function addStage(
  graph: PropertyGraph,
  decision: GraphNode,
  record: StateRecord,
): GraphNode {
  const stage = graph.ensureNode({
    id: stageId(record.workflow_id, record.stage_id),
    label: NodeLabel.Stage,
    properties: {},
  });
  graph.addEdge({ from: decision.id, rel: RelType.InStage, to: stage.id });
  return stage;
}

function addGate(
  graph: PropertyGraph,
  decision: GraphNode,
  stage: GraphNode,
  record: StateRecord,
): void {
  if (record.gate_id === undefined) {
    return;
  }
  const gate = graph.ensureNode({
    id: gateId(record.workflow_id, record.stage_id, record.gate_id),
    label: NodeLabel.Gate,
    properties: {},
  });
  graph.ensureEdge({ from: stage.id, rel: RelType.HasGate, to: gate.id });
  graph.addEdge({ from: decision.id, rel: RelType.Decides, to: gate.id });
}

export function addDecision(
  graph: PropertyGraph,
  feature: string,
  record: StateRecord,
): void {
  const decision: GraphNode = {
    id: decisionId(feature, record),
    label: NodeLabel.Decision,
    properties: {
      status: record.status,
      timestamp: record.timestamp,
      local_override: record.local_override ?? null,
    },
  };
  graph.addNode(decision);

  addActor(graph, decision, record);
  const stage = addStage(graph, decision, record);
  addGate(graph, decision, stage, record);
  addCommit(graph, decision, record);
  addApproved(graph, decision, record);
  addDependencies(graph, decision, record);
}
