import lbug from "@ladybugdb/core";

async function main(): Promise<void> {
  const db = new lbug.Database(":memory:");
  const conn = new lbug.Connection(db);

  await conn.query("CREATE NODE TABLE Actor(id STRING PRIMARY KEY)");
  await conn.query("CREATE (:Actor {id: 'a1'})");

  const raw = await conn.query("MATCH (a:Actor) RETURN a.id AS id");
  const result = Array.isArray(raw) ? raw[0] : raw;
  if (!result) throw new Error("Query returned no result");
  console.log(await result.getAll());
}

main();
