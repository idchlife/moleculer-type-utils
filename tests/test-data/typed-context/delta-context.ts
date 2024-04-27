import { GenericObject } from "moleculer";
import { BetterTypedContext } from "../../../types/context";
import GammaService from "../moleculer-services/service-gamma";
import DeltaService from "../moleculer-services/service-delta";

type ServiceDefinitions = [
  typeof GammaService,
  typeof DeltaService
];

export type DeltaContext<P = unknown, M extends object = {}, L = GenericObject> =
  BetterTypedContext<ServiceDefinitions, P, M, L>;

