# chubbyts-negotiation

[![CI](https://github.com/chubbyts/chubbyts-negotiation/workflows/CI/badge.svg?branch=master)](https://github.com/chubbyts/chubbyts-negotiation/actions?query=workflow%3ACI)
[![Coverage Status](https://coveralls.io/repos/github/chubbyts/chubbyts-negotiation/badge.svg?branch=master)](https://coveralls.io/github/chubbyts/chubbyts-negotiation?branch=master)
[![Infection MSI](https://badge.stryker-mutator.io/github.com/chubbyts/chubbyts-negotiation/master)](https://dashboard.stryker-mutator.io/reports/github.com/chubbyts/chubbyts-negotiation/master)
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

 * node: 14
 * [@chubbyts/chubbyts-http-types][2]: ^1.0.0

## Installation

Through [NPM](https://www.npmjs.com) as [@chubbyts/chubbyts-negotiation][1].

```ts
npm i @chubbyts/chubbyts-negotiation
```

## Usage

### Accept-Language

```ts
import { createAcceptLanguageNegotiator } from '@chubbyts/chubbyts-negotiation/dist/accept-language-negotiator';

const request = { headers: { 'accept-language': ['de,en;q=0.3,en-US;q=0.7'] } };

const negotiator = createAcceptLanguageNegotiator(['en', 'de']);
const value = negotiator(request);
```

### Accept

```ts
import { createAcceptNegotiator } from '@chubbyts/chubbyts-negotiation/dist/accept-negotiator';

const request = { headers: { accept: ['text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q =0.8'] } };

const negotiator = createAcceptNegotiator(['application/json', 'application/xml', 'application/x-yaml']);
const value = negotiator(request);
```

### Content-Type

```ts
import { createContentTypeNegotiator } from '@chubbyts/chubbyts-negotiation/dist/content-type-negotiator';

const request = { headers: { 'content-type': ['application/xml; charset=UTF-8'] } };

const negotiator = createContentTypeNegotiator(['application/json', 'application/xml', 'application/x-yaml']);
const value = negotiator($request);
```

## Copyright

Dominik Zogg 2022

[1]: https://www.npmjs.com/package/@chubbyts/chubbyts-negotiation
[2]: https://www.npmjs.com/package/@chubbyts/chubbyts-http-types
