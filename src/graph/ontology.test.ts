import { describe, it, expect } from "vitest";
import { isAllowedEdge, NodeLabel, RelType } from "./ontology.js";

describe("ontology", () => {
  it("has unique relationship names", () => {
    const values = Object.values(RelType);
    expect(new Set(values).size).toBe(values.length);
  });

  it("uses the label as its own value", () => {
    expect(NodeLabel.Actor).toBe("Actor");
  });
});

it("allows a decision to approve an artifact", () => {
  expect(
    isAllowedEdge(NodeLabel.Decision, RelType.Approved, NodeLabel.Artifact),
  ).toBe(true);
});

it("rejects an actor approving a stage", () => {
  expect(
    isAllowedEdge(NodeLabel.Actor, RelType.Approved, NodeLabel.Stage),
  ).toBe(false);
});

it("allows a decision to rely on another decision", () => {
  expect(
    isAllowedEdge(NodeLabel.Decision, RelType.ReliesOn, NodeLabel.Decision),
  ).toBe(true);
});
