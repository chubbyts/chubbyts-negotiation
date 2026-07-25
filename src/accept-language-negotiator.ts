import type { NegotiatedValue, Negotiator } from './negotiation.js';
import { resolveHeaderToMap } from './negotiation.js';

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
  for (const [locale, attributes] of headerToMap.entries()) {
    if (supportedValues.includes(locale)) {
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
