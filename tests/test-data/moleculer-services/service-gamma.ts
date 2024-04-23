import { ServiceSchema, Context } from "moleculer";

export default {
  name: "service:gamma" as const,
  version: 3 as const,
  actions: {
    gammaAction(ctx: Context<{ version: string }>) {
      return {
        something: 34
      };
    },
    gammaActionWithObjectDefinition: {
      handler(ctx: Context<{ myParam: number }, { log: boolean }>) {
        return { name: "object" };
      }
    }
  }
} satisfies ServiceSchema;