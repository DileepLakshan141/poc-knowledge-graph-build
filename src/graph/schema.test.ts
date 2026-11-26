import { describe, it, expect } from "vitest";
import { buildSchemaDdl, nodeTableDdl, relTableDdl } from "./schema.js";
import { NodeLabel, RelType } from "./ontology.js";

describe("schema ddl", () => {
  it("declares the decision columns", () => {
    expect(nodeTableDdl(NodeLabel.Decision)).toBe(
      "CREATE NODE TABLE `Decision`(id STRING, status STRING, timestamp STRING, local_override BOOLEAN, PRIMARY KEY (id))",
    );
  });

  it("declares a relationship from the rule table", () => {
    expect(relTableDdl(RelType.Approved)).toBe(
      "CREATE REL TABLE `APPROVED`(FROM `Decision` TO `Artifact`)",
    );
  });

  it("creates every node table before any relationship table", () => {
    const statements = buildSchemaDdl();
    const lastNode = statements
      .map((s) => s.startsWith("CREATE NODE"))
      .lastIndexOf(true);
    const firstRel = statements.findIndex((s) => s.startsWith("CREATE REL"));
    expect(lastNode).toBeLessThan(firstRel);
  });

  it("has one statement per label and relationship", () => {
    expect(buildSchemaDdl()).toHaveLength(
      Object.keys(NodeLabel).length + Object.keys(RelType).length,
    );
  });
});
