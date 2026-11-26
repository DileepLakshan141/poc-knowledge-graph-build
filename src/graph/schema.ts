import { EdgeRules, NodeLabel, NodeProperties, RelType } from "./ontology.js";

export function nodeTableDdl(label: NodeLabel): string {
  const columns = [
    "id STRING",
    ...Object.entries(NodeProperties[label]).map(
      ([name, type]) => `${name} ${type}`,
    ),
    "PRIMARY KEY (id)",
  ];
  return `CREATE NODE TABLE \`${label}\`(${columns.join(", ")})`;
}

export function relTableDdl(rel: RelType): string {
  const { from, to } = EdgeRules[rel];
  return `CREATE REL TABLE \`${rel}\`(FROM \`${from}\` TO \`${to}\`)`;
}

export function buildSchemaDdl(): string[] {
  return [
    ...Object.values(NodeLabel).map(nodeTableDdl),
    ...Object.values(RelType).map(relTableDdl),
  ];
}
