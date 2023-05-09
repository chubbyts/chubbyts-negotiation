import type { NegotiatedValue, Negotiator } from './negotiation';
import { resolveHeaderToMap } from './negotiation';

const compareLanguage = (
  locale: string,
  supportedValues: Array<string>,
  attributes: Record<string, string>,
): NegotiatedValue | undefined => {
  const localeParts = locale.match(/([^-]+)-([^-]+)$/);

  if (null === localeParts) {
    return undefined;
  }

  const language = localeParts[1];

  if (supportedValues.some((supportedLocale) => supportedLocale === language)) {
    return { value: language, attributes };
  }

  return undefined;
};

const compareAcceptLanguages = (
  supportedValues: Array<string>,
  headerToMap: Map<string, Record<string, string>>,
): NegotiatedValue | undefined => {
  for (const [locale, attributes] of headerToMap.entries()) {
    if (-1 !== supportedValues.indexOf(locale)) {
      return { value: locale, attributes };
    }
  }

  for (const [locale, attributes] of headerToMap.entries()) {
    const negotiatedValue = compareLanguage(locale, supportedValues, attributes);

    if (undefined !== negotiatedValue) {
      return negotiatedValue;
    }
  }

  if (headerToMap.has('*')) {
    return { value: supportedValues[0], attributes: headerToMap.get('*') as Record<string, string> };
  }

  return undefined;
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
