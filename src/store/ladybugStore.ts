import lbug from "@ladybugdb/core";
import { EdgeRules, NodeProperties } from "../graph/ontology.js";
import type {
  GraphEdge,
  GraphNode,
  PropertyGraph,
  PropertyValue,
} from "../graph/propertyGraph.js";
import { buildSchemaDdl } from "../graph/schema.js";

type Connection = InstanceType<typeof lbug.Connection>;

export type Row = Record<string, unknown>;

export class LadybugStore {
  private constructor(private readonly conn: Connection) {}

  static async create(): Promise<LadybugStore> {
    const db = new lbug.Database(":memory:");
    const store = new LadybugStore(new lbug.Connection(db));
    for (const statement of buildSchemaDdl()) {
      await store.query(statement);
    }
    return store;
  }

  async query(cypher: string): Promise<Row[]> {
    const raw = await this.conn.query(cypher);
    const result = Array.isArray(raw) ? raw[0] : raw;
    if (!result) {
      throw new Error(`No result for: ${cypher}`);
    }
    return await result.getAll();
  }

  async load(graph: PropertyGraph): Promise<void> {
    for (const node of graph.allNodes()) {
      await this.insertNode(node);
    }
    for (const edge of graph.allEdges()) {
      await this.insertEdge(edge);
    }
  }

  private async insertNode(node: GraphNode): Promise<void> {
    const declared = NodeProperties[node.label];
    const present = Object.entries(node.properties).filter(
      ([, value]) => value !== null,
    );
    for (const [name] of present) {
      if (!(name in declared)) {
        throw new Error(`Property ${name} is not declared for ${node.label}`);
      }
    }
    const params = { id: node.id, ...Object.fromEntries(present) };
    const assignments = Object.keys(params)
      .map((key) => `${key}: $${key}`)
      .join(", ");
    await this.run(`CREATE (:\`${node.label}\` {${assignments}})`, params);
  }

  private async insertEdge(edge: GraphEdge): Promise<void> {
    const { from, to } = EdgeRules[edge.rel];
    await this.run(
      `MATCH (a:\`${from}\` {id: $src}), (b:\`${to}\` {id: $dst}) CREATE (a)-[:\`${edge.rel}\`]->(b)`,
      { src: edge.from, dst: edge.to },
    );
  }

  private async run(
    cypher: string,
    params: Record<string, PropertyValue>,
  ): Promise<void> {
    const prepared = await this.conn.prepare(cypher);
    await this.conn.execute(prepared, params);
  }
}
