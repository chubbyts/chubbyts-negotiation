# chubbyts-negotiation

[![CI](https://github.com/chubbyts/chubbyts-negotiation/workflows/CI/badge.svg?branch=master)](https://github.com/chubbyts/chubbyts-negotiation/actions?query=workflow%3ACI)
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

 * node: 16

## Installation

Through [NPM](https://www.npmjs.com) as [@chubbyts/chubbyts-negotiation][1].

```ts
npm i @chubbyts/chubbyts-negotiation@^3.2.2
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

## Copyright

2023 Dominik Zogg

[1]: https://www.npmjs.com/package/@chubbyts/chubbyts-negotiation
