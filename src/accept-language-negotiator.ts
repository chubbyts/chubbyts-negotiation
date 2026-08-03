import type { NegotiatedValue, Negotiator } from './negotiation.js';
import {
  resolveAcceptableAndRefused,
  resolveExactMatch,
  resolveHeaderToMap,
  resolveWildcardMatch,
} from './negotiation.js';

const compareLanguage = (
  locale: string,
  supportedValues: Array<string>,
  attributes: Record<string, string>,
): NegotiatedValue | undefined => {
  const localeParts = locale.split('-');
  const language = localeParts.at(-2) ?? locale;

  if ('' === localeParts.at(-1)) {
    return undefined;
  }

  if (supportedValues.includes(language)) {
    return { value: language, attributes };
  }

  return undefined;
};

const compareAcceptLanguages = (
  supportedValues: Array<string>,
  headerToMap: Map<string, Record<string, string>>,
): NegotiatedValue | undefined => {
  const { acceptableEntries, refusedValues } = resolveAcceptableAndRefused(headerToMap);

  const isRefusedExactly = (supportedValue: string): boolean => refusedValues.includes(supportedValue);

  const isRefusedByLanguage = (supportedValue: string): boolean =>
    refusedValues.some((locale) => undefined !== compareLanguage(locale, [supportedValue], {}));

  const exactMatch = resolveExactMatch(supportedValues, acceptableEntries);

  if (undefined !== exactMatch) {
    return exactMatch;
  }

  for (const [locale, attributes] of acceptableEntries) {
    const negotiatedValue = compareLanguage(locale, supportedValues, attributes);

    if (undefined !== negotiatedValue && !isRefusedExactly(negotiatedValue.value)) {
      return negotiatedValue;
    }
  }

  return resolveWildcardMatch(
    '*',
    acceptableEntries,
    supportedValues,
    (supportedValue) => isRefusedExactly(supportedValue) || isRefusedByLanguage(supportedValue),
  );
};

export const createAcceptLanguageNegotiator = (supportedValues: Array<string>): Negotiator => {
  return {
    negotiate: (header: string) => {
      const headerToMap = resolveHeaderToMap(header);

      return compareAcceptLanguages(supportedValues, headerToMap);
    },
    supportedValues,
  };
};
