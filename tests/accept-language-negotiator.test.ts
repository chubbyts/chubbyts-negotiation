import { describe, expect, test } from 'vitest';
import { createAcceptLanguageNegotiator } from '../src/accept-language-negotiator';

describe('accept-language-negotiator', () => {
  test('without supported mime types', () => {
    const negotiator = createAcceptLanguageNegotiator([]);

    expect(negotiator.negotiate('')).toBeUndefined();
  });

  test('without header', () => {
    const negotiator = createAcceptLanguageNegotiator(['en']);

    expect(negotiator.negotiate('')).toBeUndefined();
  });

  [
    {
      acceptLanguage: 'de, en;q=0.3, en-US;q=0.7',
      supportedLocales: ['en', 'de'],
      expectedAcceptLanguage: { value: 'de', attributes: { q: '1.0' } },
    },
    {
      acceptLanguage: 'de, en -US;q    =0.7, en;     q=0.3',
      supportedLocales: ['en', 'de'],
      expectedAcceptLanguage: { value: 'de', attributes: { q: '1.0' } },
    },
    {
      acceptLanguage: 'de,en;q=0.3,en   - US ; q = 0.7',
      supportedLocales: ['en'],
      expectedAcceptLanguage: { value: 'en', attributes: { q: '0.3' } },
    },
    {
      acceptLanguage: 'de,                       en ; q                   =         0.3   ',
      supportedLocales: ['en'],
      expectedAcceptLanguage: { value: 'en', attributes: { q: '0.3' } },
    },
    {
      acceptLanguage: 'pt ; q= 0.5,de,en;q=0.3',
      supportedLocales: ['fr'],
      expectedAcceptLanguage: undefined,
    },
    {
      acceptLanguage: 'en-US;q=0.7, *;q=0.3, fr; q=0.8',
      supportedLocales: ['de'],
      expectedAcceptLanguage: { value: 'de', attributes: { q: '0.3' } },
    },
    {
      acceptLanguage: 'en-US;q=0.7, *;q=0.3, fr; q=0.8',
      supportedLocales: ['fr'],
      expectedAcceptLanguage: { value: 'fr', attributes: { q: '0.8' } },
    },
    {
      acceptLanguage: 'en; q=0.1, fr; q=0.4, fu; q=0.9, de; q=0.2',
      supportedLocales: ['de', 'fu', 'en'],
      expectedAcceptLanguage: { value: 'fu', attributes: { q: '0.9' } },
    },
    {
      acceptLanguage: 'de-CH,de;q=0.8',
      supportedLocales: ['de'],
      expectedAcceptLanguage: { value: 'de', attributes: { q: '0.8' } },
    },
    {
      acceptLanguage: 'de-CH',
      supportedLocales: ['de'],
      expectedAcceptLanguage: { value: 'de', attributes: { q: '1.0' } },
    },
    {
      acceptLanguage: 'de',
      supportedLocales: ['de-CH'],
      expectedAcceptLanguage: undefined,
    },
    {
      acceptLanguage: '*,de;q=0.1',
      supportedLocales: ['de'],
      expectedAcceptLanguage: { value: 'de', attributes: { q: '0.1' } },
    },
    {
      acceptLanguage: 'de-DE-AT,en-US',
      supportedLocales: ['de'],
      expectedAcceptLanguage: undefined,
    },
    {
      acceptLanguage: 'en,fr,it,de-CH',
      supportedLocales: ['de'],
      expectedAcceptLanguage: { value: 'de', attributes: { q: '1.0' } },
    },
    {
      // invalid header - semicolon without qvalue key pair
      acceptLanguage: 'de;',
      supportedLocales: ['de'],
      expectedAcceptLanguage: { value: 'de', attributes: { q: '1.0' } },
    },
    {
      // invalid header - semicolon without qvalue key pair
      acceptLanguage: 'de;q',
      supportedLocales: ['de'],
      expectedAcceptLanguage: { value: 'de', attributes: { q: '1.0' } },
    },
  ].forEach(({ acceptLanguage, supportedLocales, expectedAcceptLanguage }) => {
    test(`negotiate: ${JSON.stringify({ acceptLanguage, supportedLocales })}`, () => {
      const negotiator = createAcceptLanguageNegotiator(supportedLocales);

      expect(negotiator.negotiate(acceptLanguage)).toEqual(expectedAcceptLanguage);
    });
  });
});
