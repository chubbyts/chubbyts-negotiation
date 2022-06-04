import { ServerRequest } from '@chubbyts/chubbyts-http-types/dist/message';
import { NegotiatedValue, Negotiator } from './negotiation';

const resolveMediaTypes = (header: string): Map<string, Record<string, string>> => {
  return new Map(
    header
      .split(',')
      .map((headerValue): [string, Record<string, string>] => {
        const headerValueParts = headerValue.split(';');
        const mediaType = (headerValueParts.shift() as string).trim();
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

        return [mediaType, attributes];
      })
      .sort((entryA, entryB) => entryB[1]['q'].localeCompare(entryA[1]['q'])),
  );
};

const escapeStringRegexp = (regex: string): string => {
  return regex.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const compareMediaTypeWithTypeOnly = (
  supportedValues: Array<string>,
  mediaType: string,
  attributes: Record<string, string>,
): NegotiatedValue | undefined => {
  const mediaTypeParts = mediaType.match(/([^\/+]+)\/\*/);

  if (null === mediaTypeParts) {
    return undefined;
  }

  for (const supportedValue of supportedValues) {
    if (null !== supportedValue.match(new RegExp('^' + escapeStringRegexp(mediaTypeParts[1]) + '/'))) {
      return { value: supportedValue, attributes };
    }
  }

  return undefined;
};

const compareMediaTypes = (
  supportedValues: Array<string>,
  suffixSupportedValues: Map<string | undefined, string>,
  mediaTypes: Map<string, Record<string, string>>,
): NegotiatedValue | undefined => {
  for (const [mediaType, attributes] of mediaTypes.entries()) {
    if (-1 !== supportedValues.indexOf(mediaType)) {
      return { value: mediaType, attributes };
    }
  }

  for (const [mediaType, attributes] of mediaTypes.entries()) {
    if (suffixSupportedValues.has(mediaType)) {
      return { value: suffixSupportedValues.get(mediaType) as string, attributes };
    }
  }

  for (const [mediaType, attributes] of mediaTypes.entries()) {
    const negotiatedValue = compareMediaTypeWithTypeOnly(supportedValues, mediaType, attributes);

    if (undefined !== negotiatedValue) {
      return negotiatedValue;
    }
  }

  if (mediaTypes.has('*/*')) {
    return { value: supportedValues[0], attributes: mediaTypes.get('*/*') as Record<string, string> };
  }

  return undefined;
};

export const createAcceptNegotiator = (supportedValues: Array<string>): Negotiator => {
  const suffixSupportedValues = new Map(
    supportedValues.map((supportedValue) => {
      const supportedValueParts = supportedValue.match(/([^\/+]+)\/([^\/+]+)\+([^\/+]+)/);

      return [
        null !== supportedValueParts ? supportedValueParts[1] + '/' + supportedValueParts[3] : undefined,
        supportedValue,
      ];
    }),
  );

  return {
    negotiate: (request: ServerRequest) => {
      const accept = request.headers['accept'];

      if (!accept) {
        return undefined;
      }

      const mediaTypes = resolveMediaTypes(accept.join(','));

      return compareMediaTypes(supportedValues, suffixSupportedValues, mediaTypes);
    },
    supportedValues,
  };
};
