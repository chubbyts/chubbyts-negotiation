import { describe, expect, test } from 'vitest';
import { useObjectMock } from '@chubbyts/chubbyts-function-mock/dist/object-mock';
import type { Container } from '@chubbyts/chubbyts-dic-types/dist/container';
import type { ConfigFactory } from '@chubbyts/chubbyts-dic-config/dist/dic-config';
import { createContainerByConfigFactory } from '@chubbyts/chubbyts-dic-config/dist/dic-config';
import { decoderServiceFactory, encoderServiceFactory } from '@chubbyts/chubbyts-decode-encode/dist/service-factory';
import type { Negotiator } from '../src/negotiation';
import type { ContentTypesAware } from '../src/service-factory';
import {
  acceptLanguageNegotiatorServiceFactory,
  acceptLanguageNegotiatorSupportedValuesServiceFactory,
  acceptNegotiatorServiceFactory,
  acceptNegotiatorSupportedValuesServiceFactory,
  contentTypeNegotiatorServiceFactory,
  contentTypeNegotiatorSupportedValuesServiceFactory,
} from '../src/service-factory';

const createContentTypesAware = (contentTypes: Array<string>): ContentTypesAware => ({ contentTypes });

describe('acceptLanguageNegotiatorSupportedValuesServiceFactory', () => {
  test('without name', () => {
    const [container, containerMocks] = useObjectMock<Container>([]);

    expect(acceptLanguageNegotiatorSupportedValuesServiceFactory()(container)).toEqual([]);

    expect(containerMocks).toHaveLength(0);
  });

  test('with name', () => {
    const [container, containerMocks] = useObjectMock<Container>([]);

    expect(acceptLanguageNegotiatorSupportedValuesServiceFactory('api')(container)).toEqual([]);

    expect(containerMocks).toHaveLength(0);
  });
});

describe('acceptLanguageNegotiatorServiceFactory', () => {
  test('without registered supported values', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      { name: 'has', parameters: ['acceptLanguageNegotiatorSupportedValues'], return: false },
    ]);

    const service = acceptLanguageNegotiatorServiceFactory()(container);

    expect(service.supportedValues).toEqual([]);
    expect(service.negotiate('de')).toBeUndefined();

    expect(containerMocks).toHaveLength(0);
  });

  test('with registered supported values', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      { name: 'has', parameters: ['acceptLanguageNegotiatorSupportedValues'], return: true },
      { name: 'get', parameters: ['acceptLanguageNegotiatorSupportedValues'], return: ['en', 'de'] },
    ]);

    const service = acceptLanguageNegotiatorServiceFactory()(container);

    expect(service.supportedValues).toEqual(['en', 'de']);
    expect(service.negotiate('de,en;q=0.3')).toEqual({ value: 'de', attributes: { q: '1.0' } });

    expect(containerMocks).toHaveLength(0);
  });

  test('with name, with registered supported values', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      { name: 'has', parameters: ['acceptLanguageNegotiatorSupportedValuesapi'], return: true },
      { name: 'get', parameters: ['acceptLanguageNegotiatorSupportedValuesapi'], return: ['fr'] },
    ]);

    const service = acceptLanguageNegotiatorServiceFactory('api')(container);

    expect(service.supportedValues).toEqual(['fr']);

    expect(containerMocks).toHaveLength(0);
  });
});

describe('acceptNegotiatorSupportedValuesServiceFactory', () => {
  test('without name', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      { name: 'get', parameters: ['encoder'], return: createContentTypesAware(['application/json']) },
    ]);

    expect(acceptNegotiatorSupportedValuesServiceFactory()(container)).toEqual(['application/json']);

    expect(containerMocks).toHaveLength(0);
  });

  test('with name', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      { name: 'get', parameters: ['encoderapi'], return: createContentTypesAware(['application/xml']) },
    ]);

    expect(acceptNegotiatorSupportedValuesServiceFactory('api')(container)).toEqual(['application/xml']);

    expect(containerMocks).toHaveLength(0);
  });
});

describe('acceptNegotiatorServiceFactory', () => {
  test('without registered supported values', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      { name: 'has', parameters: ['acceptNegotiatorSupportedValues'], return: false },
      {
        name: 'get',
        parameters: ['encoder'],
        return: createContentTypesAware(['application/json', 'application/xml']),
      },
    ]);

    const service = acceptNegotiatorServiceFactory()(container);

    expect(service.supportedValues).toEqual(['application/json', 'application/xml']);
    expect(service.negotiate('application/xml;q=0.9,*/*;q=0.8')).toEqual({
      value: 'application/xml',
      attributes: { q: '0.9' },
    });

    expect(containerMocks).toHaveLength(0);
  });

  test('with registered supported values', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      { name: 'has', parameters: ['acceptNegotiatorSupportedValues'], return: true },
      { name: 'get', parameters: ['acceptNegotiatorSupportedValues'], return: ['text/html'] },
    ]);

    const service = acceptNegotiatorServiceFactory()(container);

    expect(service.supportedValues).toEqual(['text/html']);

    expect(containerMocks).toHaveLength(0);
  });

  test('with name, without registered supported values', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      { name: 'has', parameters: ['acceptNegotiatorSupportedValuesapi'], return: false },
      { name: 'get', parameters: ['encoderapi'], return: createContentTypesAware(['application/json']) },
    ]);

    const service = acceptNegotiatorServiceFactory('api')(container);

    expect(service.supportedValues).toEqual(['application/json']);

    expect(containerMocks).toHaveLength(0);
  });

  test('with name, with registered supported values', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      { name: 'has', parameters: ['acceptNegotiatorSupportedValuesapi'], return: true },
      { name: 'get', parameters: ['acceptNegotiatorSupportedValuesapi'], return: ['text/html'] },
    ]);

    const service = acceptNegotiatorServiceFactory('api')(container);

    expect(service.supportedValues).toEqual(['text/html']);

    expect(containerMocks).toHaveLength(0);
  });
});

describe('contentTypeNegotiatorSupportedValuesServiceFactory', () => {
  test('without name', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      { name: 'get', parameters: ['decoder'], return: createContentTypesAware(['application/json']) },
    ]);

    expect(contentTypeNegotiatorSupportedValuesServiceFactory()(container)).toEqual(['application/json']);

    expect(containerMocks).toHaveLength(0);
  });

  test('with name', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      { name: 'get', parameters: ['decoderapi'], return: createContentTypesAware(['application/xml']) },
    ]);

    expect(contentTypeNegotiatorSupportedValuesServiceFactory('api')(container)).toEqual(['application/xml']);

    expect(containerMocks).toHaveLength(0);
  });
});

describe('contentTypeNegotiatorServiceFactory', () => {
  test('without registered supported values', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      { name: 'has', parameters: ['contentTypeNegotiatorSupportedValues'], return: false },
      {
        name: 'get',
        parameters: ['decoder'],
        return: createContentTypesAware(['application/json', 'application/xml']),
      },
    ]);

    const service = contentTypeNegotiatorServiceFactory()(container);

    expect(service.supportedValues).toEqual(['application/json', 'application/xml']);
    expect(service.negotiate('application/xml; charset=UTF-8')).toEqual({
      value: 'application/xml',
      attributes: { charset: 'UTF-8' },
    });

    expect(containerMocks).toHaveLength(0);
  });

  test('with registered supported values', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      { name: 'has', parameters: ['contentTypeNegotiatorSupportedValues'], return: true },
      { name: 'get', parameters: ['contentTypeNegotiatorSupportedValues'], return: ['text/html'] },
    ]);

    const service = contentTypeNegotiatorServiceFactory()(container);

    expect(service.supportedValues).toEqual(['text/html']);

    expect(containerMocks).toHaveLength(0);
  });

  test('with name, without registered supported values', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      { name: 'has', parameters: ['contentTypeNegotiatorSupportedValuesapi'], return: false },
      { name: 'get', parameters: ['decoderapi'], return: createContentTypesAware(['application/json']) },
    ]);

    const service = contentTypeNegotiatorServiceFactory('api')(container);

    expect(service.supportedValues).toEqual(['application/json']);

    expect(containerMocks).toHaveLength(0);
  });

  test('with name, with registered supported values', () => {
    const [container, containerMocks] = useObjectMock<Container>([
      { name: 'has', parameters: ['contentTypeNegotiatorSupportedValuesapi'], return: true },
      { name: 'get', parameters: ['contentTypeNegotiatorSupportedValuesapi'], return: ['text/html'] },
    ]);

    const service = contentTypeNegotiatorServiceFactory('api')(container);

    expect(service.supportedValues).toEqual(['text/html']);

    expect(containerMocks).toHaveLength(0);
  });
});

describe('integration with chubbyts-dic-config and chubbyts-decode-encode', () => {
  test('without names', () => {
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

    expect(container.get<Negotiator>('acceptLanguageNegotiator').supportedValues).toEqual(['en', 'de']);
    expect(container.get<Negotiator>('acceptNegotiator').supportedValues).toEqual([
      'application/json',
      'application/jsonx+xml',
      'application/x-www-form-urlencoded',
      'application/x-yaml',
    ]);
    expect(container.get<Negotiator>('contentTypeNegotiator').supportedValues).toEqual([
      'application/json',
      'application/jsonx+xml',
      'application/x-www-form-urlencoded',
      'application/x-yaml',
    ]);
  });

  test('with names', () => {
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

    expect(container.get<Negotiator>('acceptNegotiatorapi').supportedValues).toHaveLength(4);
    expect(container.get<Negotiator>('contentTypeNegotiatorapi').supportedValues).toHaveLength(4);
    expect(container.get<Negotiator>('acceptNegotiatoradmin').supportedValues).toEqual(['text/html']);
  });
});
