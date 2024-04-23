## Moleculer Type Utils

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/idchlife/moleculer-type-utils/yarn.js.yml)

![NPM Version](https://img.shields.io/npm/v/moleculer-type-utils)


### Table of Contents

- [Intro Promo](#intro-promo)
- [What](#what)
- [Why](#why)
- [Installation](#installation)
- [Usage](#usage)

### Intro Promo

So... uh... Type safety, amiright?

This and without code generation and manually writing external interfaces:

![Sample 1](/readme-files/sample-1.png)
![Sample 2](/readme-files/sample-2.png)

Want to call actions with automattically loaded types? With names, params, meta.
Don't want to generate manually or with watcher type definitions for actions?

I got you covered. At least for Moleculer 0.14 (rumors that 0.15 version will have some types breaking changes so if you are from the future and I forgot to update this package sorry and ping me in issues or if you are brave enough fire a pull request).

### What

This package contains type helpers for working with Moleculer microservice framework.

Currently these type utils help with:

- Typed actions

### Why

I don't really like the idea of generating type definitions if it's possible to obtain type safety by utilizing fantastic and powerful TypeScript type system.

In case of Moleculer it's totally possible to create helper types for writing calls to actions.

### Installation

`yarn add moleculer-tyle-utils --dev`

or

`npm install moleculer-type-utils --save-dev`

or

similar with other package managers like pnpm, bun and others I don't know but they surely exist.


### Usage

Ok here is the receipt:

1) Write service as usual with 1 additional step:
  ```typescript
    import { ServiceSchema, Context } from "moleculer";

    export default {
      name: "service:alpha" as const, // IMPORTANT STEP : always add `as const` to the name
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

  ```
<br/>

  2) <details>
      <summary>If you are using ServiceSchema with your service - use `satisfies` instead of hard casting with `a as MyType`. Click to reveal more info on that. </summary>
   

        Notice `satisfies ServiceSchema` part. What it's for?
        If you want to achieve type safety when defining your service as well as IDE helpers with types - you usually write code like `const a: MyType = {}` or `const a = {} as MyType`.

        You WILL achieve type safety, but will loose the computed type of your object. And it won't work with this package. Because you are forcibly casting to some type, loosing the real implementation.

        Use `satisfies` instead. This way you still have type safety, but now your type can be inferred fully by TypeScript type system.
      </details>
<br/>

  3) Create file where you will store your typed broker.
    For example `types/my-broker.ts`.

      Here what you should write as it's contents:

      ```typescript
        import { BetterTypedServiceBroker } from "moleculer-type-utils";

        type ServiceDefinitions = [
          typeof import("./my-services/service-alpha").default,
          typeof import("./my-services/service-beta").default,
        ];

        type MyBroker = BetterTypedServiceBroker<ServiceDefinitions>;
      ```

      Get types of your services and store them in tuple type. This is important. Not union, but tuple (array). Then you pass this tuple as generic to `BetterTypedServiceBroker`.
<br/>

  4) Ok so now you have type `MyBroker`, which has .call method with your actions.

      Use it like this in your services:

      ```typescript
        const result = await (broker as MyBroker).call("service.actionName", ..., ...);
        // broker will help with params and meta if they are required by your action.
      ```

### Changelog

#### [0.1.0] - 2024-03-15

Initial repo. Features type for broker, that helps with action typings