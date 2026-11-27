# poc-knowledge-graph-build

## Current Workflow
<img width="762" height="372" alt="ui_ux kg-poc (1)" src="https://github.com/user-attachments/assets/cec6da67-e1b0-48ba-a135-42dab23b5ce2" />

Research proof of concept: turn the structured state files that AIDLC writes into a
knowledge graph, query it with Cypher, and answer governance questions.
Works on **synthetic data only**.

## What it does

JSON state files -> validated records -> staging graph (ontology rules enforced)
-> embedded Ladybug graph engine (in-memory) -> named Cypher queries.

## Requirements

- Node.js 20 or newer (developed on Node 24)
- npm
- No Docker and no database server: the graph engine runs inside the Node process

## Setup

```bash
git clone <this-repo-url>
cd aidlc-kg
npm install
```

Then create the fixtures (see below) and run:

```bash
npm test          # unit and integration tests
npm run typecheck # TypeScript check, no output files
npm run demo      # prints the four example governance answers
```

## Fixtures (not included in the repo)

Create the folder `fixtures/feature__t2_knowledge-discovery/` and put **9 JSON files**
in it, one record per file. File names do not matter (the real format uses hash-like
names); ordering comes from each record's `timestamp`.

| # | stage_id | gate_id | notes |
|---|---|---|---|
| 1 | intake | (none) | `event: "INIT"`, `prev_entry_sha256: null`, `approved_content_sha256: ""` |
| 2 | intake | intake-accepted | no upstream |
| 3 | context-spec | spec-approved | upstream: intake; `local_override: true` |
| 4 | component design | design-approved | upstream: context-spec |
| 5 | implementation | implementation-plan-approved | upstream: component design; `local_override: false` |
| 6 | implementation | code-ready | upstream: component design |
| 7 | verification | tests-passed | upstream: implementation |
| 8 | security review | security-approved | upstream: implementation; `local_override: true` |
| 9 | release | release-approved | upstream: verification and security review |

Example record (the INIT file):

```json
{
  "event": "INIT",
  "workflow_id": "enterprise-ai-dlc",
  "stage_id": "intake",
  "status": "PENDING",
  "action_by": "unknown",
  "attestation_type": "LOCAL_OPTIMISTIC",
  "approved_content_sha256": "",
  "entry_id": "918ea1fcc0d57c751a9740deccb9acf0",
  "prev_entry_sha256": null,
  "timestamp": "2026-11-06T15:16:12.602Z",
  "signature": "SYNTHETIC_SIGNATURE_INIT_01",
  "commit_sha": "e2294ab40e73c0f0e0055515216ac0709e322a02"
}
```

Rules for writing your own records:

- `timestamp`: ISO 8601 UTC with a trailing `Z`.
- `commit_sha`: exactly 40 lowercase hex characters.
- Every hash in `upstream_content_sha256` (a map of upstream stage name to hash) must equal
  the `approved_content_sha256` of the upstream decision, or the dependency edge will
  point at an artifact nobody approved.
- Gate decisions have a `gate_id` and an `approved_content_sha256` of a fake 64-character hex string.

Without the fixtures, `src/queries.test.ts` and `npm run demo` fail. The other tests run.

### Expected result with the full 9-file fixture

- Graph: 43 nodes, 67 edges
- Overridden approvals: `spec-approved` and `security-approved`
- If the approved code changes, stale approvals: `tests-passed`, `security-approved`, `release-approved`

## Project layout

```
src/domain/    record schema (Zod), event types
src/graph/     ontology, staging graph, builder, ids, schema generator
src/store/     Ladybug adapter (create schema, load graph, run Cypher)
src/queries.ts named Cypher queries used by the demo and tests
src/testing/   test data builder
```

## Notes

- Synthetic data only. Never commit real `.ai` state or markdown files.

## Demo Results
<img width="725" height="530" alt="image" src="https://github.com/user-attachments/assets/288caa7c-4962-4de1-b705-0c6ec3418e0a" />



