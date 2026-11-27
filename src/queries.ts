export type NamedQuery = {
  readonly id: string;
  readonly title: string;
  readonly cypher: string;
};

export const QUERIES: readonly NamedQuery[] = [
  {
    id: "security-approver",
    title: "Who approved the security review, and was an override used?",
    cypher: `
      MATCH (g:Gate {id: 'Gate:enterprise-ai-dlc:security review:security-approved'})
            <-[:DECIDES]-(d:Decision)-[:DECIDED_BY]->(a:Actor)
      RETURN a.id AS actor, d.status AS status, d.timestamp AS at, d.local_override AS override`,
  },
  {
    id: "overridden-approvals",
    title: "Which approvals were made with a local override?",
    cypher: `
      MATCH (d:Decision)-[:DECIDES]->(g:Gate)
      WHERE d.local_override = true
      RETURN g.id AS gate, d.timestamp AS at
      ORDER BY at`,
  },
  {
    id: "affected-by-code",
    title: "Which approvals relied on the approved code?",
    cypher: `
      MATCH (code:Decision)-[:DECIDES]->(:Gate {id: 'Gate:enterprise-ai-dlc:implementation:code-ready'}),
            (code)-[:APPROVED]->(art:Artifact)<-[:DEPENDS_ON]-(d:Decision)-[:DECIDES]->(g:Gate)
      RETURN g.id AS gate, d.timestamp AS at
      ORDER BY at`,
  },
];
