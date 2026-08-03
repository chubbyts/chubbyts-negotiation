import { describe, expect, test } from 'vitest';
import type { HeaderEntry } from '../src/negotiation';
import {
  resolveAcceptableAndRefused,
  resolveExactMatch,
  resolveHeaderToMap,
  resolveQuality,
  resolveWildcardMatch,
} from '../src/negotiation';

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
      // q=0 entries are kept and sorted last
      header: 'application/json;q=0, application/xml;q=0.5',
      expectMap: new Map([
        ['application/xml', { q: '0.5' }],
        ['application/json', { q: '0' }],
      ]),
    },
    {
      // invalid q ('.5' misses the leading digit) counts as 1 and gets sorted first
      header: 'de;q=.5, en;q=0.4',
      expectMap: new Map([
        ['de', { q: '.5' }],
        ['en', { q: '0.4' }],
      ]),
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

  [
    { attributes: {}, expectedQuality: 1 },
    { attributes: { q: '1' }, expectedQuality: 1 },
    { attributes: { q: '1.0' }, expectedQuality: 1 },
    { attributes: { q: '1.000' }, expectedQuality: 1 },
    { attributes: { q: '0.5' }, expectedQuality: 0.5 },
    { attributes: { q: '0.123' }, expectedQuality: 0.123 },
    { attributes: { q: '0' }, expectedQuality: 0 },
    { attributes: { q: '0.0' }, expectedQuality: 0 },
    // values not matching the RFC 9110 qvalue grammar count as absent,
    // especially ones that would parse to a q=0 refusal by prefix
    { attributes: { q: 'invalid' }, expectedQuality: 1 },
    { attributes: { q: '' }, expectedQuality: 1 },
    { attributes: { q: '.5' }, expectedQuality: 1 },
    { attributes: { q: '7' }, expectedQuality: 1 },
    { attributes: { q: '-1' }, expectedQuality: 1 },
    { attributes: { q: '-0.5' }, expectedQuality: 1 },
    { attributes: { q: '0,5' }, expectedQuality: 1 },
    { attributes: { q: '0x1F' }, expectedQuality: 1 },
    { attributes: { q: '0       .3' }, expectedQuality: 1 },
    { attributes: { q: '0.1234' }, expectedQuality: 1 },
    { attributes: { q: '1.1' }, expectedQuality: 1 },
  ].forEach(({ attributes, expectedQuality }) => {
    test(`resolveQuality: ${JSON.stringify({ attributes, expectedQuality })}`, () => {
      expect(resolveQuality(attributes)).toBe(expectedQuality);
    });
  });

  describe('resolveAcceptableAndRefused', () => {
    test('with acceptable and refused entries', () => {
      expect(
        resolveAcceptableAndRefused(
          new Map([
            ['application/xml', { q: '0.5' }],
            ['text/html', { q: '1.0' }],
            ['application/json', { q: '0' }],
          ]),
        ),
      ).toEqual({
        acceptableEntries: [
          ['application/xml', { q: '0.5' }],
          ['text/html', { q: '1.0' }],
        ],
        refusedValues: ['application/json'],
      });
    });

    test('with empty map', () => {
      expect(resolveAcceptableAndRefused(new Map())).toEqual({ acceptableEntries: [], refusedValues: [] });
    });
  });

  describe('resolveExactMatch', () => {
    const acceptableEntries: Array<HeaderEntry> = [
      ['text/html', { q: '1.0' }],
      ['application/json', { q: '0.8' }],
      ['application/xml', { q: '0.5' }],
    ];

    test('with matching supported value, first entry wins', () => {
      expect(resolveExactMatch(['application/json', 'application/xml'], acceptableEntries)).toEqual({
        value: 'application/json',
        attributes: { q: '0.8' },
      });
    });

    test('without matching supported value', () => {
      expect(resolveExactMatch(['application/x-yaml'], acceptableEntries)).toBeUndefined();
    });

    test('without acceptable entries', () => {
      expect(resolveExactMatch(['application/json'], [])).toBeUndefined();
    });
  });

  describe('resolveWildcardMatch', () => {
    const acceptableEntries: Array<HeaderEntry> = [
      ['application/json', { q: '1.0' }],
      ['*/*', { q: '0.8' }],
    ];

    test('with wildcard entry and no refused supported value', () => {
      expect(
        resolveWildcardMatch('*/*', acceptableEntries, ['application/json', 'application/xml'], () => false),
      ).toEqual({
        value: 'application/json',
        attributes: { q: '0.8' },
      });
    });

    test('with wildcard entry skips refused supported values', () => {
      expect(
        resolveWildcardMatch(
          '*/*',
          acceptableEntries,
          ['application/json', 'application/xml'],
          (supportedValue) => 'application/json' === supportedValue,
        ),
      ).toEqual({ value: 'application/xml', attributes: { q: '0.8' } });
    });

    test('with wildcard entry and all supported values refused', () => {
      expect(resolveWildcardMatch('*/*', acceptableEntries, ['application/json'], () => true)).toBeUndefined();
    });

    test('without wildcard entry', () => {
      expect(resolveWildcardMatch('*', acceptableEntries, ['application/json'], () => false)).toBeUndefined();
    });
  });
});
