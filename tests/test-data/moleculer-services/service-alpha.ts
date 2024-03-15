import { ServiceSchema, Context } from "moleculer";

export default {
  name: "service:alpha" as const,
  actions: {
    alphaAction(ctx: Context<{ name: string }>) {
      return "kek";
    },
    alphaActionWithoutParamsAndMeta(ctx: Context) {
      return "value";
    },
    alphaActionWithoutParamsWithMeta(ctx: Context<null, { userId: string }>) {
      return 24;
    },
    alphaActionWithVoidReturn(ctx: Context) {}
  }
} satisfies ServiceSchema;
