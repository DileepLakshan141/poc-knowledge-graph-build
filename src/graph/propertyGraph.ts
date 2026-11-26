import { type NodeLabel, type RelType, isAllowedEdge } from "./ontology.js";

export type PropertyValue = string | number | boolean | null;

export type GraphNode = {
  readonly id: string;
  readonly label: NodeLabel;
  readonly properties: Readonly<Record<string, PropertyValue>>;
};

export type GraphEdge = {
  readonly from: string;
  readonly rel: RelType;
  readonly to: string;
};

function edgeKey(edge: GraphEdge): string {
  return `${edge.from}|${edge.rel}|${edge.to}`;
}

export class PropertyGraph {
  private readonly nodes = new Map<string, GraphNode>();
  private readonly edges: GraphEdge[] = [];
  private readonly edgeKeys = new Set<string>();

  addNode(node: GraphNode): void {
    if (this.nodes.has(node.id)) {
      throw new Error(`Node already exists: ${node.id}`);
    }
    this.nodes.set(node.id, node);
  }

  ensureNode(node: GraphNode): GraphNode {
    const existing = this.nodes.get(node.id);
    if (existing) {
      if (existing.label !== node.label) {
        throw new Error(
          `Id ${node.id} already used by label ${existing.label}`,
        );
      }
      return existing;
    }
    this.addNode(node);
    return node;
  }

  getNode(id: string): GraphNode | undefined {
    return this.nodes.get(id);
  }

  get nodeCount(): number {
    return this.nodes.size;
  }

  addEdge(edge: GraphEdge): void {
    const from = this.nodes.get(edge.from);
    const to = this.nodes.get(edge.to);
    if (!from || !to) {
      throw new Error(
        `Edge endpoint missing: ${edge.from} -[${edge.rel}]-> ${edge.to}`,
      );
    }
    if (!isAllowedEdge(from.label, edge.rel, to.label)) {
      throw new Error(
        `Edge not allowed by ontology: ${from.label} -[${edge.rel}]-> ${to.label}`,
      );
    }
    this.edges.push(edge);
    this.edgeKeys.add(edgeKey(edge));
  }

  ensureEdge(edge: GraphEdge): void {
    if (this.edgeKeys.has(edgeKey(edge))) {
      return;
    }
    this.addEdge(edge);
  }

  get edgeCount(): number {
    return this.edges.length;
  }
}
