import type { Container } from '@chubbyts/chubbyts-dic-types/dist/container';
import { createAbstractFactory } from '@chubbyts/chubbyts-dic-config-factory/dist/dic-config-factory';
import { createAcceptLanguageNegotiator } from './accept-language-negotiator.js';
import { createAcceptNegotiator } from './accept-negotiator.js';
import { createContentTypeNegotiator } from './content-type-negotiator.js';
import type { Negotiator } from './negotiation.js';

/**
 * The minimal shape of a decoder / encoder (as shipped by `@chubbyts/chubbyts-decode-encode`)
 * from which the supported media types get reused.
 */
export type ContentTypesAware = {
  contentTypes: Array<string>;
};

export const acceptLanguageNegotiatorSupportedValuesServiceFactory = createAbstractFactory((): Array<string> => {
  return [];
});

export const acceptLanguageNegotiatorServiceFactory = createAbstractFactory(
  (container: Container, { resolveDependency }): Negotiator => {
    return createAcceptLanguageNegotiator(
      resolveDependency(
        container,
        'acceptLanguageNegotiatorSupportedValues',
        acceptLanguageNegotiatorSupportedValuesServiceFactory,
      ),
    );
  },
);

export const acceptNegotiatorSupportedValuesServiceFactory = createAbstractFactory(
  (container: Container, { name }): Array<string> => {
    return container.get<ContentTypesAware>('encoder' + name).contentTypes;
  },
);

export const acceptNegotiatorServiceFactory = createAbstractFactory(
  (container: Container, { resolveDependency }): Negotiator => {
    return createAcceptNegotiator(
      resolveDependency(container, 'acceptNegotiatorSupportedValues', acceptNegotiatorSupportedValuesServiceFactory),
    );
  },
);

export const contentTypeNegotiatorSupportedValuesServiceFactory = createAbstractFactory(
  (container: Container, { name }): Array<string> => {
    return container.get<ContentTypesAware>('decoder' + name).contentTypes;
  },
);

export const contentTypeNegotiatorServiceFactory = createAbstractFactory(
  (container: Container, { resolveDependency }): Negotiator => {
    return createContentTypeNegotiator(
      resolveDependency(
        container,
        'contentTypeNegotiatorSupportedValues',
        contentTypeNegotiatorSupportedValuesServiceFactory,
      ),
    );
  },
);
