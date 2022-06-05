import { describe, expect, test } from '@jest/globals';
import { resolveHeaderToMap } from '../src/negotiation';

describe('negotiation', () => {
  [
    {
      header: 'text/html, */*;q =0.8 ,   application/xhtml+xml; q=1.0, application/xml; q=0.9',
      expectMap: new Map([
        ['text/html', { q: '1.0' }],
        ['application/xhtml+xml', { q: '1.0' }],
        ['application/xml', { q: '0.9' }],
        ['*/*', { q: '0.8' }],
      ]),
    },
    {
      header: 'text/html,   application/xhtml+xml,application/xml; q   =   0.9 ,     */    *;q = 0.8',
      expectMap: new Map([
        ['text/html', { q: '1.0' }],
        ['application/xhtml+xml', { q: '1.0' }],
        ['application/xml', { q: '0.9' }],
        ['*/    *', { q: '0.8' }],
      ]),
    },
    {
      header: 'text/html,application/xhtml+xml ,application/xml; q=0.9 ,*/*;  q= 0.8',
      expectMap: new Map([
        ['text/html', { q: '1.0' }],
        ['application/xhtml+xml', { q: '1.0' }],
        ['application/xml', { q: '0.9' }],
        ['*/*', { q: '0.8' }],
      ]),
    },
    {
      header: '*/json, */xml',
      expectMap: new Map([
        ['*/json', { q: '1.0' }],
        ['*/xml', { q: '1.0' }],
      ]),
    },
    {
      header: 'application/*;q=0.5, application/json',
      expectMap: new Map([
        ['application/json', { q: '1.0' }],
        ['application/*', { q: '0.5' }],
      ]),
    },
    {
      header: 'application/*, application/json;q=0.5',
      expectMap: new Map([
        ['application/*', { q: '1.0' }],
        ['application/json', { q: '0.5' }],
      ]),
    },
    {
      header: 'application/*, application/json;q=0.5, application/xml;q=0.8',
      expectMap: new Map([
        ['application/*', { q: '1.0' }],
        ['application/xml', { q: '0.8' }],
        ['application/json', { q: '0.5' }],
      ]),
    },
    {
      header: 'application/json/json',
      expectMap: new Map([['application/json/json', { q: '1.0' }]]),
    },
    {
      header: 'application, text, applicatio/*',
      expectMap: new Map([
        ['application', { q: '1.0' }],
        ['text', { q: '1.0' }],
        ['applicatio/*', { q: '1.0' }],
      ]),
    },
    {
      header: 'xml, application/json;q=0.5',
      expectMap: new Map([
        ['xml', { q: '1.0' }],
        ['application/json', { q: '0.5' }],
      ]),
    },
    {
      header: 'xml, application/json; q=0.2, application/*;q=0.5',
      expectMap: new Map([
        ['xml', { q: '1.0' }],
        ['application/*', { q: '0.5' }],
        ['application/json', { q: '0.2' }],
      ]),
    },
    {
      header: '*/*,application/*;q=0.5',
      expectMap: new Map([
        ['*/*', { q: '1.0' }],
        ['application/*', { q: '0.5' }],
      ]),
    },
    {
      header: 'text/html;q=0.1,application/*;q=0.5,application/xml;q=0.9',
      expectMap: new Map([
        ['application/xml', { q: '0.9' }],
        ['application/*', { q: '0.5' }],
        ['text/html', { q: '0.1' }],
      ]),
    },
    {
      header: 'xml, application/xml ; q=0.6, application/json;q=0.5',
      expectMap: new Map([
        ['xml', { q: '1.0' }],
        ['application/xml', { q: '0.6' }],
        ['application/json', { q: '0.5' }],
      ]),
    },
    {
      header: '*/*, application/json;q=0.9, application/xml;q=0.1',
      expectMap: new Map([
        ['*/*', { q: '1.0' }],
        ['application/json', { q: '0.9' }],
        ['application/xml', { q: '0.1' }],
      ]),
    },
    {
      header: 'text/html, application/*;q=0.1',
      expectMap: new Map([
        ['text/html', { q: '1.0' }],
        ['application/*', { q: '0.1' }],
      ]),
    },
    {
      header: 'text/html, applicatio[]n./*;q=0.1',
      expectMap: new Map([
        ['text/html', { q: '1.0' }],
        ['applicatio[]n./*', { q: '0.1' }],
      ]),
    },
    {
      header: 'application/json ; q=1.0, application/ld+xml; q=0.8, application/ld+json; q=0.3',
      expectMap: new Map([
        ['application/json', { q: '1.0' }],
        ['application/ld+xml', { q: '0.8' }],
        ['application/ld+json', { q: '0.3' }],
      ]),
    },
    {
      header: 'application/json ; q=1.0, application/ld+xml; q=0.8',
      expectMap: new Map([
        ['application/json', { q: '1.0' }],
        ['application/ld+xml', { q: '0.8' }],
      ]),
    },
    {
      header: 'application/json;',
      expectMap: new Map([['application/json', { q: '1.0' }]]),
    },
    {
      header: 'application/json;q',
      expectMap: new Map([['application/json', { q: '1.0' }]]),
    },
    {
      header: 'de, en;q=0.3, en-US;q=0.7',
      expectMap: new Map([
        ['de', { q: '1.0' }],
        ['en-US', { q: '0.7' }],
        ['en', { q: '0.3' }],
      ]),
    },
    {
      header: 'de, en -US;q    =0.7, en;     q=0.3',
      expectMap: new Map([
        ['de', { q: '1.0' }],
        ['en -US', { q: '0.7' }],
        ['en', { q: '0.3' }],
      ]),
    },
    {
      header: 'de,en;q=0.3,en   - US ; q = 0.7',
      expectMap: new Map([
        ['de', { q: '1.0' }],
        ['en   - US', { q: '0.7' }],
        ['en', { q: '0.3' }],
      ]),
    },
    {
      header: 'de,                       en ; q                   =         0.3   ',
      expectMap: new Map([
        ['de', { q: '1.0' }],
        ['en', { q: '0.3' }],
      ]),
    },
    {
      header: 'de,                       en ; q                   =         0       .3   ',
      expectMap: new Map([
        ['de', { q: '1.0' }],
        ['en', { q: '0       .3' }],
      ]),
    },
    {
      header: 'pt ; q= 0.5,de,en;q=0.3',
      expectMap: new Map([
        ['de', { q: '1.0' }],
        ['pt', { q: '0.5' }],
        ['en', { q: '0.3' }],
      ]),
    },
    {
      header: 'en-US;q=0.7, *;q=0.3, fr; q=0.8',
      expectMap: new Map([
        ['fr', { q: '0.8' }],
        ['en-US', { q: '0.7' }],
        ['*', { q: '0.3' }],
      ]),
    },
    {
      header: 'en-US;q=0.7, *;q=0.3, fr; q=0.8',
      expectMap: new Map([
        ['fr', { q: '0.8' }],
        ['en-US', { q: '0.7' }],
        ['*', { q: '0.3' }],
      ]),
    },
    {
      header: 'en; q=0.1, fr; q=0.4, fu; q=0.9, de; q=0.2',
      expectMap: new Map([
        ['fu', { q: '0.9' }],
        ['fr', { q: '0.4' }],
        ['de', { q: '0.2' }],
        ['en', { q: '0.1' }],
      ]),
    },
    {
      header: 'de-CH,de;q=0.8',
      expectMap: new Map([
        ['de-CH', { q: '1.0' }],
        ['de', { q: '0.8' }],
      ]),
    },
    {
      header: 'de-CH',
      expectMap: new Map([['de-CH', { q: '1.0' }]]),
    },
    {
      header: 'de',
      expectMap: new Map([['de', { q: '1.0' }]]),
    },
    {
      header: '*,de;q=0.1',
      expectMap: new Map([
        ['*', { q: '1.0' }],
        ['de', { q: '0.1' }],
      ]),
    },
    {
      header: 'de-DE-AT,en-US',
      expectMap: new Map([
        ['de-DE-AT', { q: '1.0' }],
        ['en-US', { q: '1.0' }],
      ]),
    },
    {
      header: 'en,fr,it,de-CH',
      expectMap: new Map([
        ['en', { q: '1.0' }],
        ['fr', { q: '1.0' }],
        ['it', { q: '1.0' }],
        ['de-CH', { q: '1.0' }],
      ]),
    },
    {
      header: 'de;',
      expectMap: new Map([['de', { q: '1.0' }]]),
    },
    {
      header: 'de;q',
      expectMap: new Map([['de', { q: '1.0' }]]),
    },
    {
      header: ' application/xml ; charset = UTF-8 ',
      expectMap: new Map([['application/xml', { charset: 'UTF-8', q: '1.0' }]]),
    },
    {
      header: 'application/xml                 ; charset=UTF-8',
      expectMap: new Map([['application/xml', { charset: 'UTF-8', q: '1.0' }]]),
    },
    {
      header: 'application/xml; charset=UTF-8,',
      expectMap: new Map([['application/xml', { charset: 'UTF-8', q: '1.0' }]]),
    },
    {
      header: 'xml; charset=UTF-8',
      expectMap: new Map([['xml', { charset: 'UTF-8', q: '1.0' }]]),
    },
    {
      header: 'application/jsonx+xml; charset=UTF-8',
      expectMap: new Map([['application/jsonx+xml', { charset: 'UTF-8', q: '1.0' }]]),
    },
    {
      header: 'application/jsonx+xml; charset=UTF-8, application/jsonx+xml; charset=UTF-8',
      expectMap: new Map([['application/jsonx+xml', { charset: 'UTF-8', q: '1.0' }]]),
    },
    {
      header: 'application/jsonx+xml; charset=UTF-8',
      expectMap: new Map([['application/jsonx+xml', { charset: 'UTF-8', q: '1.0' }]]),
    },
    {
      header: '',
      expectMap: new Map([]),
    },
  ].forEach(({ header, expectMap }) => {
    test(`resolveHeaderToMap: ${JSON.stringify({ header, expectMap })}`, () => {
      const map = resolveHeaderToMap(header);
      expect(map).toEqual(expectMap);
    });
  });
});
