import { buildSchemaDdl } from "./graph/schema.js";

for (const statement of buildSchemaDdl()) {
  console.log(statement);
}
