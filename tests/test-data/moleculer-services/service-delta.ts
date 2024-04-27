import { ServiceSchema, Context } from "moleculer";
import type { DeltaContext } from "../typed-context/delta-context";

/**
 * This service is a WIP for testing usage of context in it's
 * actions definitions. Unfortunately due to circular reference error
 * it's still WIP. Trying to overcome this and find a new easy way
 * to use context
 */
export default {
  name: "service:delta" as const,
  actions: {
    deltaAction(ctx: DeltaContext<{ version: string }>) {
      return {
        something: 34
      };
    },
    deltaActionWithObjectDefinition: {
      handler(ctx: DeltaContext<{ myParam: number }, { log: boolean }>) {
        return { name: "object" };
      }
    }
  }
};