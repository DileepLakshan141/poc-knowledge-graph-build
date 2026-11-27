import { describe, it, expect } from "vitest";
import { buildGraph } from "./buildGraph.js";
import { decisionId } from "./ids.js";
import { RelType } from "./ontology.js";
import { aGateDecision } from "../testing/recordBuilder.js";

const feature = "feature__test";

describe("buildGraph reliance", () => {
  it("links a decision to the decision that approved its upstream hash", () => {
    const approver = aGateDecision({
      approved_content_sha256: "h1",
      timestamp: "2026-11-06T16:00:00.000Z",
    });
    const dependent = aGateDecision({
      stage_id: "verification",
      gate_id: "tests-passed",
      timestamp: "2026-11-07T10:00:00.000Z",
      upstream_content_sha256: { implementation: "h1" },
    });

    const graph = buildGraph(feature, [dependent, approver]);
    const reliance = graph.allEdges().filter((e) => e.rel === RelType.ReliesOn);

    expect(reliance).toEqual([
      {
        from: decisionId(feature, dependent),
        rel: RelType.ReliesOn,
        to: decisionId(feature, approver),
      },
    ]);
  });
});
