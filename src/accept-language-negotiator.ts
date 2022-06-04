import { ServerRequest } from '@chubbyts/chubbyts-http-types/dist/message';
import { NegotiatedValue, Negotiator } from './negotiation';

const resolveAcceptLanguages = (header: string): Map<string, Record<string, string>> => {
  return new Map(
    header
      .split(',')
      .map((headerValue): [string, Record<string, string>] => {
        const headerValueParts = headerValue.split(';');
        const locale = (headerValueParts.shift() as string).trim();
        const attributes: Record<string, string> = Object.fromEntries(
          headerValueParts
            .filter((attribute) => -1 !== attribute.search(/=/))
            .map((attribute): [string, string] => {
              const [attributeKey, attributeValue] = attribute.split('=');

              return [attributeKey.trim(), attributeValue.trim()];
            }),
        );

        if (!attributes['q']) {
          attributes['q'] = '1.0';
        }

        return [locale, attributes];
      })
      .sort((entryA, entryB) => entryB[1]['q'].localeCompare(entryA[1]['q'])),
  );
};

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
  acceptLanguages: Map<string, Record<string, string>>,
): NegotiatedValue | undefined => {
  for (const [locale, attributes] of acceptLanguages.entries()) {
    if (-1 !== supportedValues.indexOf(locale)) {
      return { value: locale, attributes };
    }
  }

  for (const [locale, attributes] of acceptLanguages.entries()) {
    const negotiatedValue = compareLanguage(locale, supportedValues, attributes);

    if (undefined !== negotiatedValue) {
      return negotiatedValue;
    }
  }

  if (acceptLanguages.has('*')) {
    return { value: supportedValues[0], attributes: acceptLanguages.get('*') as Record<string, string> };
  }

  return undefined;
};

export const createAcceptLanguageNegotiator = (supportedValues: Array<string>): Negotiator => {
  return {
    negotiate: (request: ServerRequest) => {
      const acceptLanguage = request.headers['accept-language'];

      if (!acceptLanguage) {
        return undefined;
      }

      const acceptLanguages = resolveAcceptLanguages(acceptLanguage.join(','));

      return compareAcceptLanguages(supportedValues, acceptLanguages);
    },
    supportedValues,
  };
};
