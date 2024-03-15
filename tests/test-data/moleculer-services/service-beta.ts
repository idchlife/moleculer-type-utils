import { ServiceSchema, Context } from "moleculer";

export default {
  name: "service:beta" as const,
  actions: {
    betaAction(ctx: Context<{ version: string }>) {
      return {
        something: 34
      };
    },
    betaActionWithObjectDefinition: {
      handler(ctx: Context<{ myParam: number }, { log: boolean }>) {
        return { name: "object" };
      }
    }
  }
};