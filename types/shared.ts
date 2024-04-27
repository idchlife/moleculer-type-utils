import type { GenericObject, ServiceSchema } from "moleculer"

export type ServiceSchemaTuple = ServiceSchema[];

export type UnionOfValuesOfObject<TObject extends { [key in keyof TObject]: unknown }> =
  TObject[keyof TObject];

export type TupleToUnion<TTuple extends unknown[]> = TTuple[number];

export type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

export type PromisifyIfNotPromise<T> = T extends Promise<unknown> ? T : Promise<T>;

export type EmptyObject = {
  [key in any]: never
};

export interface ContextLike<P = unknown, M extends object = {}, L = GenericObject> {
  params: P
  meta: M
  locals: L
}