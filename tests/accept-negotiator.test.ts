import { describe, expect, test } from '@jest/globals';
import { ServerRequest } from '@chubbyts/chubbyts-http-types/dist/message';
import { createAcceptNegotiator } from '../src/accept-negotiator';

const createRequest = (accept?: Array<string> | undefined): ServerRequest => {
  if (undefined === accept) {
    return { headers: {} } as ServerRequest;
  }

  return { headers: { accept } } as unknown as ServerRequest;
};

describe('accept-negotiator', () => {
  test('without supported mime types', () => {
    const negotiator = createAcceptNegotiator([]);

    expect(negotiator.negotiate(createRequest())).toBeUndefined();
  });

  test('without header', () => {
    const negotiator = createAcceptNegotiator(['application/json']);

    expect(negotiator.negotiate(createRequest())).toBeUndefined();
  });

  [
    {
      accept: ['text/html', '*/*;q =0.8 ', '   application/xhtml+xml; q=1.0', 'application/xml; q=0.9'],
      supportedMediaTypes: ['application/json', 'application/xml', 'application/x-yaml'],
      expectedAccept: { value: 'application/xml', attributes: { q: '0.9' } },
    },
    {
      accept: ['text/html,   application/xhtml+xml,application/xml; q   =   0.9 ,     */    *;q = 0.8'],
      supportedMediaTypes: ['application/json', 'application/xml', 'application/x-yaml'],
      expectedAccept: { value: 'application/xml', attributes: { q: '0.9' } },
    },
    {
      accept: ['text/html,application/xhtml+xml ,application/xml; q=0.9 ,*/*;  q= 0.8'],
      supportedMediaTypes: ['application/json'],
      expectedAccept: { value: 'application/json', attributes: { q: '0.8' } },
    },
    {
      accept: ['*/json, */xml'],
      supportedMediaTypes: ['application/xml'],
      expectedAccept: undefined,
    },
    {
      accept: ['application/*;q=0.5, application/json'],
      supportedMediaTypes: ['application/xml', 'application/json'],
      expectedAccept: { value: 'application/json', attributes: { q: '1.0' } },
    },
    {
      accept: ['application/*, application/json;q=0.5'],
      supportedMediaTypes: ['application/xml', 'application/json'],
      expectedAccept: { value: 'application/json', attributes: { q: '0.5' } },
    },
    {
      accept: ['application/*, application/json;q=0.5, application/xml;q=0.8'],
      supportedMediaTypes: ['text/html'],
      expectedAccept: undefined,
    },
    {
      accept: ['application/json/json'],
      supportedMediaTypes: ['application/json'],
      expectedAccept: undefined,
    },
    {
      accept: ['application, text, applicatio/*'],
      supportedMediaTypes: ['application/json'],
      expectedAccept: undefined,
    },
    {
      accept: ['application, text, pplication/*'],
      supportedMediaTypes: ['application/json'],
      expectedAccept: undefined,
    },
    {
      accept: ['application, text, application/*'],
      supportedMediaTypes: ['application/json'],
      expectedAccept: { value: 'application/json', attributes: { q: '1.0' } },
    },
    {
      accept: ['xml, application/json;q=0.5'],
      supportedMediaTypes: ['application/json'],
      expectedAccept: { value: 'application/json', attributes: { q: '0.5' } },
    },
    {
      accept: ['xml, application/json; q=0.2, application/*;q=0.5'],
      supportedMediaTypes: ['application/json'],
      expectedAccept: { value: 'application/json', attributes: { q: '0.2' } },
    },
    {
      accept: ['*/*,application/*;q=0.5'],
      supportedMediaTypes: ['text/html', 'application/json'],
      expectedAccept: { value: 'application/json', attributes: { q: '0.5' } },
    },
    {
      accept: ['text/html;q=0.1,application/*;q=0.5,application/xml;q=0.9'],
      supportedMediaTypes: ['text/html', 'application/json', 'application/xml'],
      expectedAccept: { value: 'application/xml', attributes: { q: '0.9' } },
    },
    {
      accept: ['xml, application/xml ; q=0.6, application/json;q=0.5'],
      supportedMediaTypes: ['application/json'],
      expectedAccept: { value: 'application/json', attributes: { q: '0.5' } },
    },
    {
      accept: ['*/*, application/json;q=0.9, application/xml;q=0.1'],
      supportedMediaTypes: ['application/xml'],
      expectedAccept: { value: 'application/xml', attributes: { q: '0.1' } },
    },
    {
      accept: ['text/html, application/*;q=0.1'],
      supportedMediaTypes: ['application/json'],
      expectedAccept: { value: 'application/json', attributes: { q: '0.1' } },
    },
    {
      accept: ['text/html, applicatio[]n./*;q=0.1'],
      supportedMediaTypes: ['application/json'],
      expectedAccept: undefined,
    },
    {
      accept: ['application/json ; q=1.0, application/ld+xml; q=0.8, application/ld+json; q=0.3'],
      supportedMediaTypes: ['application/ld+json'],
      expectedAccept: { value: 'application/ld+json', attributes: { q: '0.3' } },
    },
    {
      accept: ['application/json ; q=1.0, application/ld+xml; q=0.8, application/ld+json; q=0.3'],
      supportedMediaTypes: ['application/ld+yaml', 'application/ld+json', 'application/ld+xml'],
      expectedAccept: { value: 'application/ld+xml', attributes: { q: '0.8' } },
    },
    {
      accept: ['application/json ; q=1.0, application/ld+xml; q=0.8'],
      supportedMediaTypes: ['application/xml', 'application/ld+json'],
      expectedAccept: { value: 'application/ld+json', attributes: { q: '1.0' } },
    },
    {
      accept: ['application/json;'],
      supportedMediaTypes: ['application/json'],
      expectedAccept: { value: 'application/json', attributes: { q: '1.0' } },
    },
    {
      accept: ['application/json;q'],
      supportedMediaTypes: ['application/json'],
      expectedAccept: { value: 'application/json', attributes: { q: '1.0' } },
    },
  ].forEach(({ accept, supportedMediaTypes, expectedAccept }) => {
    test(`negotiate: ${JSON.stringify({ accept, supportedMediaTypes })}`, () => {
      const negotiator = createAcceptNegotiator(supportedMediaTypes);

      expect(negotiator.negotiate(createRequest(accept))).toEqual(expectedAccept);
    });
  });
});
