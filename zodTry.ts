import { z } from "zod";

const EventSchema = z.enum(["INIT", "GATE_DECISION"]);
const result = EventSchema.safeParse("GATE_DECISON");
console.log(result.success ? "ok" : result.error.issues);
