import { z } from "zod";

export const EventTypeSchema = z.enum(["INIT", "GATE_DECISION"]);

export type EventType = z.infer<typeof EventTypeSchema>;

export function describeEvent(event: EventType): string {
  return event === "INIT" ? "Workflow started" : "A gate was decided";
}
