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
      .sort((entryA, entryB) => (entryB[1]['q'] as string).localeCompare(entryA[1]['q'] as string)),
  );
};

const escapeStringRegexp = (regex: string): string => {
  return regex.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const compareMediaTypeWithTypeOnly = (
  supportedMediaTypes: Array<string>,
  mediaType: string,
  attributes: Record<string, string>,
): NegotiatedValue | undefined => {
  const mediaTypeParts = mediaType.match(/([^\/+]+)\/\*/);

  if (null === mediaTypeParts) {
    return undefined;
  }

  for (const supportedMediaType of supportedMediaTypes) {
    if (null !== supportedMediaType.match(new RegExp('^' + escapeStringRegexp(mediaTypeParts[1]) + '/'))) {
      return { value: supportedMediaType, attributes };
    }
  }

  return undefined;
};

const compareMediaTypes = (
  supportedMediaTypes: Array<string>,
  suffixBasedSupportedMediaTypes: Map<string | undefined, string>,
  mediaTypes: Map<string, Record<string, string>>,
): NegotiatedValue | undefined => {
  for (const [mediaType, attributes] of mediaTypes.entries()) {
    if (-1 !== supportedMediaTypes.indexOf(mediaType)) {
      return { value: mediaType, attributes };
    }
  }

  for (const [mediaType, attributes] of mediaTypes.entries()) {
    if (suffixBasedSupportedMediaTypes.has(mediaType)) {
      return { value: suffixBasedSupportedMediaTypes.get(mediaType) as string, attributes };
    }
  }

  for (const [mediaType, attributes] of mediaTypes.entries()) {
    const negotiatedValue = compareMediaTypeWithTypeOnly(supportedMediaTypes, mediaType, attributes);

    if (undefined !== negotiatedValue) {
      return negotiatedValue;
    }
  }

  if (mediaTypes.has('*/*')) {
    return { value: supportedMediaTypes[0], attributes: mediaTypes.get('*/*') as Record<string, string> };
  }

  return undefined;
};

export const createAcceptNegotiator = (supportedMediaTypes: Array<string>): Negotiator => {
  const suffixBasedSupportedMediaTypes = new Map(
    supportedMediaTypes.map((supportedMediaType) => {
      const supportedMediaTypeParts = supportedMediaType.match(/([^\/+]+)\/([^\/+]+)\+([^\/+]+)/);

      return [
        null !== supportedMediaTypeParts ? supportedMediaTypeParts[1] + '/' + supportedMediaTypeParts[3] : undefined,
        supportedMediaType,
      ];
    }),
  );

  return (request: ServerRequest) => {
    const accept = request.headers['accept'];

    if (!accept) {
      return undefined;
    }

    const mediaTypes = resolveMediaTypes(accept.join(','));

    return compareMediaTypes(supportedMediaTypes, suffixBasedSupportedMediaTypes, mediaTypes);
  };
};
