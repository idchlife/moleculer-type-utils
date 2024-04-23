import type { Context, GenericObject } from "moleculer";
import { ServiceSchemaTuple } from "./shared";
import { BetterTypedServiceBroker, BrokerCallFunctionDefinitionFromSchemaTuple } from "./broker";

type ContextWithoutCallBroker<P = unknown, M extends object = {}, L = GenericObject> = Omit<Context<P, M, L>, "call" | "broker">;

export type BetterTypedContext<TSchemaTuple extends ServiceSchemaTuple, P = unknown, M extends object = {}, L = GenericObject> =
  {
    call: BrokerCallFunctionDefinitionFromSchemaTuple<TSchemaTuple>
    broker: BetterTypedServiceBroker<TSchemaTuple>
  } & ContextWithoutCallBroker<P, M, L>;