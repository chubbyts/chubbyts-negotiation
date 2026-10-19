# chubbyts-negotiation

[![CI](https://github.com/chubbyts/chubbyts-negotiation/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/chubbyts/chubbyts-negotiation/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/chubbyts/chubbyts-negotiation/badge.svg?branch=master)](https://coveralls.io/github/chubbyts/chubbyts-negotiation?branch=master)
[![Mutation testing badge](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fchubbyts%2Fchubbyts-negotiation%2Fmaster)](https://dashboard.stryker-mutator.io/reports/github.com/chubbyts/chubbyts-negotiation/master)
[![npm-version](https://img.shields.io/npm/v/@chubbyts/chubbyts-negotiation.svg)](https://www.npmjs.com/package/@chubbyts/chubbyts-negotiation)

[![bugs](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-negotiation&metric=bugs)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-negotiation)
[![code_smells](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-negotiation&metric=code_smells)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-negotiation)
[![coverage](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-negotiation&metric=coverage)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-negotiation)
[![duplicated_lines_density](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-negotiation&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-negotiation)
[![ncloc](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-negotiation&metric=ncloc)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-negotiation)
[![sqale_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-negotiation&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-negotiation)
[![alert_status](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-negotiation&metric=alert_status)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-negotiation)
[![reliability_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-negotiation&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-negotiation)
[![security_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-negotiation&metric=security_rating)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-negotiation)
[![sqale_index](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-negotiation&metric=sqale_index)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-negotiation)
[![vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=chubbyts_chubbyts-negotiation&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=chubbyts_chubbyts-negotiation)

## Description

A simple negotiation library.

## Requirements

 * node: 22
 * [@chubbyts/chubbyts-dic-config-factory][4]: ^1.0.1
 * [@chubbyts/chubbyts-dic-types][2]: ^2.3.1

## Installation

Through [NPM](https://www.npmjs.com) as [@chubbyts/chubbyts-negotiation][1].

```ts
npm i @chubbyts/chubbyts-negotiation@^4.5.2
```

## Usage

### Accept-Language

```ts
import { createAcceptLanguageNegotiator } from '@chubbyts/chubbyts-negotiation/dist/accept-language-negotiator';

const negotiator = createAcceptLanguageNegotiator(['en', 'de']);
const value = negotiator.negotiate('de,en;q=0.3,en-US;q=0.7');
```

### Accept

```ts
import { createAcceptNegotiator } from '@chubbyts/chubbyts-negotiation/dist/accept-negotiator';

const negotiator = createAcceptNegotiator(['application/json', 'application/xml', 'application/x-yaml']);
const value = negotiator.negotiate('text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q =0.8');
```

### Content-Type

```ts
import { createContentTypeNegotiator } from '@chubbyts/chubbyts-negotiation/dist/content-type-negotiator';

const negotiator = createContentTypeNegotiator(['application/json', 'application/xml', 'application/x-yaml']);
const value = negotiator.negotiate('application/xml; charset=UTF-8');
```

### Service factories (chubbyts-dic-config)

The package ships service factories (abstract factories built on [chubbyts-dic-config-factory][4]) for a [chubbyts-dic-config][3] (or any [chubbyts-dic-types][2] compatible) container within `@chubbyts/chubbyts-negotiation/dist/service-factory`.

Each negotiator reads its supported values from a `<negotiator>SupportedValues` service if registered, and falls back to a default otherwise:

 * `acceptLanguageNegotiatorServiceFactory`: `acceptLanguageNegotiatorSupportedValues`, default `[]`
 * `acceptNegotiatorServiceFactory`: `acceptNegotiatorSupportedValues`, default the `contentTypes` of the `encoder` service
 * `contentTypeNegotiatorServiceFactory`: `contentTypeNegotiatorSupportedValues`, default the `contentTypes` of the `decoder` service

The defaults are designed to reuse the type decoders / encoders of [chubbyts-decode-encode][5] (or anything else shaped like `{ contentTypes: Array<string> }`), so the negotiators support exactly what can be decoded / encoded:

```ts
import type { ConfigFactory } from '@chubbyts/chubbyts-dic-config/dist/dic-config';
import { createContainerByConfigFactory } from '@chubbyts/chubbyts-dic-config/dist/dic-config';
import { decoderServiceFactory, encoderServiceFactory } from '@chubbyts/chubbyts-decode-encode/dist/service-factory';
import type { Negotiator } from '@chubbyts/chubbyts-negotiation/dist/negotiation';
import {
  acceptLanguageNegotiatorServiceFactory,
  acceptNegotiatorServiceFactory,
  contentTypeNegotiatorServiceFactory,
} from '@chubbyts/chubbyts-negotiation/dist/service-factory';

const container = createContainerByConfigFactory({
  dependencies: {
    factories: new Map<string, ConfigFactory>([
      ['decoder', decoderServiceFactory()],
      ['encoder', encoderServiceFactory()],
      ['acceptLanguageNegotiator', acceptLanguageNegotiatorServiceFactory()],
      ['acceptLanguageNegotiatorSupportedValues', (): Array<string> => ['en', 'de']],
      ['acceptNegotiator', acceptNegotiatorServiceFactory()],
      ['contentTypeNegotiator', contentTypeNegotiatorServiceFactory()],
    ]),
  },
})();

const acceptLanguageNegotiator = container.get<Negotiator>('acceptLanguageNegotiator'); // en, de
const acceptNegotiator = container.get<Negotiator>('acceptNegotiator'); // all encoder content types
const contentTypeNegotiator = container.get<Negotiator>('contentTypeNegotiator'); // all decoder content types
```

To override the supported values, register the related service:

```ts
const container = createContainerByConfigFactory({
  dependencies: {
    factories: new Map<string, ConfigFactory>([
      ['acceptNegotiator', acceptNegotiatorServiceFactory()],
      ['acceptNegotiatorSupportedValues', (): Array<string> => ['application/json']],
    ]),
  },
})();
```

#### With names

To negotiate different parts of an application with different supported values, the same factories can be registered multiple times with a name, which gets appended to each service id (`acceptNegotiatorapi`, `acceptNegotiatorSupportedValuesapi`, `encoderapi`, ...).

```ts
const container = createContainerByConfigFactory({
  dependencies: {
    factories: new Map<string, ConfigFactory>([
      ['decoderapi', decoderServiceFactory('api')],
      ['encoderapi', encoderServiceFactory('api')],
      ['acceptNegotiatorapi', acceptNegotiatorServiceFactory('api')],
      ['contentTypeNegotiatorapi', contentTypeNegotiatorServiceFactory('api')],
      ['acceptNegotiatoradmin', acceptNegotiatorServiceFactory('admin')],
      ['acceptNegotiatorSupportedValuesadmin', (): Array<string> => ['text/html']],
    ]),
  },
})();

const apiAcceptNegotiator = container.get<Negotiator>('acceptNegotiatorapi'); // content types of encoderapi
const adminAcceptNegotiator = container.get<Negotiator>('acceptNegotiatoradmin'); // text/html
```

## Copyright

2026 Dominik Zogg

[1]: https://www.npmjs.com/package/@chubbyts/chubbyts-negotiation
[2]: https://www.npmjs.com/package/@chubbyts/chubbyts-dic-types
[3]: https://www.npmjs.com/package/@chubbyts/chubbyts-dic-config
[4]: https://www.npmjs.com/package/@chubbyts/chubbyts-dic-config-factory
[5]: https://www.npmjs.com/package/@chubbyts/chubbyts-decode-encode
