export const NodeLabel = {
  Feature: "Feature",
  Workflow: "Workflow",
  Stage: "Stage",
  Gate: "Gate",
  Decision: "Decision",
  Actor: "Actor",
  Commit: "Commit",
  Artifact: "Artifact",
} as const;

export type NodeLabel = (typeof NodeLabel)[keyof typeof NodeLabel];

export const RelType = {
  HasStage: "HAS_STAGE",
  HasGate: "HAS_GATE",
  InStage: "IN_STAGE",
  DecidedBy: "DECIDED_BY",
  AtCommit: "AT_COMMIT",
  Approved: "APPROVED",
  DependsOn: "DEPENDS_ON",
  FollowedBy: "FOLLOWED_BY",
  Decides: "DECIDES",
  InFeature: "IN_FEATURE",
  ReliesOn: "RELIES_ON",
} as const;

export type RelType = (typeof RelType)[keyof typeof RelType];

export const EdgeRules: Record<RelType, { from: NodeLabel; to: NodeLabel }> = {
  [RelType.HasStage]: { from: NodeLabel.Workflow, to: NodeLabel.Stage },
  [RelType.HasGate]: { from: NodeLabel.Stage, to: NodeLabel.Gate },
  [RelType.InStage]: { from: NodeLabel.Decision, to: NodeLabel.Stage },
  [RelType.Decides]: { from: NodeLabel.Decision, to: NodeLabel.Gate },
  [RelType.InFeature]: { from: NodeLabel.Decision, to: NodeLabel.Feature },
  [RelType.DecidedBy]: { from: NodeLabel.Decision, to: NodeLabel.Actor },
  [RelType.AtCommit]: { from: NodeLabel.Decision, to: NodeLabel.Commit },
  [RelType.Approved]: { from: NodeLabel.Decision, to: NodeLabel.Artifact },
  [RelType.DependsOn]: { from: NodeLabel.Decision, to: NodeLabel.Artifact },
  [RelType.FollowedBy]: { from: NodeLabel.Decision, to: NodeLabel.Decision },
  [RelType.ReliesOn]: { from: NodeLabel.Decision, to: NodeLabel.Decision },
};

export function isAllowedEdge(
  from: NodeLabel,
  rel: RelType,
  to: NodeLabel,
): boolean {
  const rule = EdgeRules[rel];
  return rule.from === from && rule.to === to;
}

export type PropertyType = "STRING" | "BOOLEAN";

export const NodeProperties: Record<
  NodeLabel,
  Readonly<Record<string, PropertyType>>
> = {
  [NodeLabel.Feature]: {},
  [NodeLabel.Workflow]: {},
  [NodeLabel.Stage]: {},
  [NodeLabel.Gate]: {},
  [NodeLabel.Actor]: {},
  [NodeLabel.Commit]: {},
  [NodeLabel.Artifact]: {},
  [NodeLabel.Decision]: {
    status: "STRING",
    timestamp: "STRING",
    local_override: "BOOLEAN",
  },
};
