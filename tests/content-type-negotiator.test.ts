import { describe, expect, test } from '@jest/globals';
import { ServerRequest } from '@chubbyts/chubbyts-http-types/dist/message';
import { createContentTypeNegotiator } from '../src/content-type-negotiator';

const createRequest = (contentType?: Array<string> | undefined): ServerRequest => {
  if (undefined === contentType) {
    return { headers: {} } as ServerRequest;
  }

  return { headers: { 'content-type': contentType } } as unknown as ServerRequest;
};

describe('content-type-negotiator', () => {
  test('without supported mime types', () => {
    const negotiator = createContentTypeNegotiator([]);

    expect(negotiator(createRequest())).toBeUndefined();
  });

  test('without header', () => {
    const negotiator = createContentTypeNegotiator(['application/json']);

    expect(negotiator(createRequest())).toBeUndefined();
  });

  [
    {
      contentType: [' application/xml ; charset = UTF-8 '],
      supportedMediaTypes: ['application/json', 'application/xml', 'application/x-yaml'],
      expectedContentType: { value: 'application/xml', attributes: { charset: 'UTF-8' } },
    },
    {
      contentType: ['application/xml                 ; charset=UTF-8'],
      supportedMediaTypes: ['application/json'],
      expectedContentType: undefined,
    },
    {
      contentType: ['application/xml; charset=UTF-8,'],
      supportedMediaTypes: ['application/json', 'application/xml', 'application/x-yaml'],
      expectedContentType: undefined,
    },
    {
      contentType: ['xml; charset=UTF-8'],
      supportedMediaTypes: ['application/xml'],
      expectedContentType: undefined,
    },
    {
      contentType: ['application/jsonx+xml; charset=UTF-8'],
      supportedMediaTypes: ['application/xml'],
      expectedContentType: { value: 'application/xml', attributes: { charset: 'UTF-8' } },
    },
    {
      contentType: ['application/jsonx+xml; charset=UTF-8', 'application/jsonx+xml; charset=UTF-8'],
      supportedMediaTypes: ['application/xml'],
      expectedContentType: undefined,
    },
    {
      contentType: ['application/jsonx+xml; charset=UTF-8'],
      supportedMediaTypes: ['application/json'],
      expectedContentType: undefined,
    },
    {
      contentType: [''],
      supportedMediaTypes: ['application/json'],
      expectedContentType: undefined,
    },
  ].forEach(({ contentType, supportedMediaTypes, expectedContentType }) => {
    test(`negotiate: ${JSON.stringify({ contentType, supportedMediaTypes })}`, () => {
      const negotiator = createContentTypeNegotiator(supportedMediaTypes);

      expect(negotiator(createRequest(contentType))).toEqual(expectedContentType);
    });
  });
});
