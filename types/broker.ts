import {
  ServiceSchema,
  CallingOptions,
  Context,
} from "moleculer";

export type BetterTypedServiceBroker<TSchemaTuple extends ServiceSchema[]> =
  BrokerDefinitionFromSchemaTuple<TSchemaTuple>;

type ActionsWithStringKeys<TServiceSchema extends ServiceSchema> = {
  [key in keyof TServiceSchema["actions"] extends string ? keyof TServiceSchema["actions"] : never]: TServiceSchema["actions"][key]
}

type ActionMethods<TServiceSchema extends ServiceSchema> =
  keyof ActionsWithStringKeys<TServiceSchema>;

type FullServiceActionName<TServiceSchema extends ServiceSchema, TActionName extends ActionMethods<TServiceSchema>> =
  (TServiceSchema["version"] extends string | number ? `v${TServiceSchema["version"]}.${TServiceSchema["name"]}.${TActionName}` : `${TServiceSchema["name"]}.${TActionName}`);

type ServiceBrokerCallDefinitionForActionInfo<TServiceSchema extends ServiceSchema, TActionName extends ActionMethods<TServiceSchema>> =
  TServiceSchema["actions"][TActionName] extends (ctx: Context<infer P, infer M, infer L>) => infer R
    ?
    {
      // Fix for "unknown" type by default.
      // With unknown type inferred - IsOptionalType check failes
      // because unknown type can mean any not optional type for typescript.
      // Meaning IsOptionalType<unknown> = false. Which means
      // params will be *required* parameter. Which we do not want
      // because if params were inferred as unknown - no types were
      // defined by developer for params. 
      params: IsRequiredType<P> extends true ? P : null | undefined, 
      meta: M,
      promise: L,
      returnType: R,
      actionName: FullServiceActionName<TServiceSchema, TActionName>
    }
    :
    TServiceSchema["actions"][TActionName] extends {
      handler: (ctx: Context<infer P2, infer M2, infer L2>) => infer R2
    }
      ?
      {
        params: IsRequiredType<P2> extends true ? P2 : null | undefined, 
        meta: M2,
        promise: L2,
        returnType: R2,
        actionName: FullServiceActionName<TServiceSchema, TActionName>
      }     
      :
      never;

type BrokerDefinitionFromSchemaTuple<TSchemaTuple extends ServiceSchema[]> = {
  call: BrokerCallFunctionDefinition<
    IntersectionOfFullDefinitions<TSchemaTuple> extends BrokerCallDefinitionsForServiceWithFullName<ServiceSchema> ? IntersectionOfFullDefinitions<TSchemaTuple> : never
  >
}
  
type TupleOfFullDefinitions<TSchemaTuple extends ServiceSchema[]> =
  TupleOfSchemasToTupleOfFullDefinitions<TSchemaTuple>;

type UnionOfFullDefinitions<TSchemaTuple extends ServiceSchema[]> =
  TupleToUnion<TupleOfFullDefinitions<TSchemaTuple>>;

type IntersectionOfFullDefinitions<TSchemaTuple extends ServiceSchema[]> =
  UnionToIntersection<UnionOfFullDefinitions<TSchemaTuple>>;

type TupleOfSchemasToTupleOfFullDefinitions<TSchemaTuple extends ServiceSchema[]> = {
  [key in keyof TSchemaTuple]: BrokerCallDefinitionsForServiceWithFullName<TSchemaTuple[key]>
};

type TupleToUnion<TTuple extends unknown[]> = TTuple[number];

type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

type BrokerCallDefinitionsForService<TServiceSchema extends ServiceSchema> = {
  [key in keyof ActionsWithStringKeys<TServiceSchema>]: ServiceBrokerCallDefinitionForActionInfo<TServiceSchema, key>
};

type TransformBrokerCallDefinitionsWithFullName<TDefinitionUnion extends { "actionName": string }> = {
  [key in TDefinitionUnion["actionName"]]: TDefinitionUnion extends { "actionName": key } ? TDefinitionUnion : never
}

type UnionOfValuesOfObject<TObject extends { [key in keyof TObject]: unknown }> =
  TObject[keyof TObject];

type BrokerCallDefinitionsForServiceWithFullName<TServiceSchema extends ServiceSchema> =
  TransformBrokerCallDefinitionsWithFullName<UnionOfValuesOfObject<BrokerCallDefinitionsForService<TServiceSchema>>>;

// BACKUP
// type BrokerCallFunctionDefinition<TFullNameDefinitions extends BrokerCallDefinitionsForServiceWithFullName<TServiceSchema>, TServiceSchema extends ServiceSchema = ServiceSchema> =
//   <TAction extends keyof TFullNameDefinitions>(
//     actionName: TAction,
//     params?: TFullNameDefinitions[TAction]["params"],
//     opts?: {
//       meta: TFullNameDefinitions[TAction]["meta"]
//     } & CallingOptions
//   ) => TFullNameDefinitions[TAction]["returnType"];

type EmptyObject = {
  [key in any]: never
};

type PromisifyIfNotPromise<T> = T extends Promise<unknown> ? T : Promise<T>;

type IsOptionalType<T> = T extends null | undefined | EmptyObject ? true : false;
type IsRequiredType<T> = T extends string | number | boolean | object ? true : false;

type BrokerCallFunctionDefinition<TFullNameDefinitions extends BrokerCallDefinitionsForServiceWithFullName<TServiceSchema>, TServiceSchema extends ServiceSchema = ServiceSchema> =
  <TAction extends keyof TFullNameDefinitions>(
    actionName: TAction,
    ...args: (
      IsOptionalType<TFullNameDefinitions[TAction]["meta"]> extends false
        ?
        [
          params: IsOptionalType<TFullNameDefinitions[TAction]["params"]> extends false ? TFullNameDefinitions[TAction]["params"] : any,
          opts: {
            meta: TFullNameDefinitions[TAction]["meta"]
          } & CallingOptions
        ]
        :
        (
          IsOptionalType<TFullNameDefinitions[TAction]["params"]> extends false
            ?
            [
              params: TFullNameDefinitions[TAction]["params"],
              opts?: CallingOptions
            ]
            :
            [
              params?: TFullNameDefinitions[TAction]["params"],
              opts?: CallingOptions
            ]           
        )
    )
  ) => PromisifyIfNotPromise<TFullNameDefinitions[TAction]["returnType"]>;
