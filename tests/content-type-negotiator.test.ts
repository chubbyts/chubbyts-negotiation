import { describe, expect, test } from 'vitest';
import { createContentTypeNegotiator } from '../src/content-type-negotiator';

describe('content-type-negotiator', () => {
  test('without supported mime types', () => {
    const negotiator = createContentTypeNegotiator([]);

    expect(negotiator.negotiate('')).toBeUndefined();
  });

  test('without header', () => {
    const negotiator = createContentTypeNegotiator(['application/json']);

    expect(negotiator.negotiate('')).toBeUndefined();
  });

  [
    {
      contentType: ' application/xml ; charset = UTF-8 ',
      supportedMediaTypes: ['application/json', 'application/xml', 'application/x-yaml'],
      expectedContentType: { value: 'application/xml', attributes: { charset: 'UTF-8' } },
    },
    {
      contentType: 'application/xml                 ; charset=UTF-8',
      supportedMediaTypes: ['application/json'],
      expectedContentType: undefined,
    },
    {
      contentType: 'application/xml; charset=UTF-8,',
      supportedMediaTypes: ['application/json', 'application/xml', 'application/x-yaml'],
      expectedContentType: { value: 'application/xml', attributes: { charset: 'UTF-8' } },
    },
    {
      contentType: 'xml; charset=UTF-8',
      supportedMediaTypes: ['application/xml'],
      expectedContentType: undefined,
    },
    {
      contentType: 'application/jsonx+xml; charset=UTF-8',
      supportedMediaTypes: ['application/xml'],
      expectedContentType: { value: 'application/xml', attributes: { charset: 'UTF-8' } },
    },
    {
      contentType: 'application/jsonx+xml; charset=LATIN-1, application/jsonx+xml; charset=UTF-8',
      supportedMediaTypes: ['application/xml'],
      expectedContentType: { value: 'application/xml', attributes: { charset: 'UTF-8' } },
    },
    {
      contentType: 'application/json; charset=UTF-8, application/jsonx+xml; charset=UTF-8',
      supportedMediaTypes: ['application/json', 'application/xml'],
      expectedContentType: undefined,
    },
    {
      contentType: 'application/jsonx+xml; charset=UTF-8',
      supportedMediaTypes: ['application/json'],
      expectedContentType: undefined,
    },
    {
      contentType: '',
      supportedMediaTypes: ['application/json'],
      expectedContentType: undefined,
    },
  ].forEach(({ contentType, supportedMediaTypes, expectedContentType }) => {
    test(`negotiate: ${JSON.stringify({ contentType, supportedMediaTypes })}`, () => {
      const negotiator = createContentTypeNegotiator(supportedMediaTypes);

      expect(negotiator.negotiate(contentType)).toEqual(expectedContentType);
    });
  });
});
