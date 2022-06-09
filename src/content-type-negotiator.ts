import { resolveHeaderToMap, NegotiatedValue, Negotiator } from './negotiation';

const compareMediaTypeWithSuffix = (
  supportedValues: Array<string>,
  mediaType: string,
  attributes: Record<string, string>,
): NegotiatedValue | undefined => {
  const mediaTypeParts = mediaType.match(/([^\/]+)\/([^+]+)\+(.+)/);

  if (null === mediaTypeParts) {
    return undefined;
  }

  const mediaTypeFromParts = mediaTypeParts[1] + '/' + mediaTypeParts[3];

  if (-1 !== supportedValues.indexOf(mediaTypeFromParts)) {
    return { value: mediaTypeFromParts, attributes };
  }
};

const compareMediaTypes = (
  supportedValues: Array<string>,
  headerToMap: Map<string, Record<string, string>>,
): NegotiatedValue | undefined => {
  const entries = Array.from(headerToMap.entries());
  if (entries.length !== 1) {
    return undefined;
  }

  const [mediaType, attributes] = entries[0];
  const { q, ...otherAttriutes } = attributes;

  if (-1 !== supportedValues.indexOf(mediaType)) {
    return { value: mediaType, attributes: otherAttriutes };
  }

  return compareMediaTypeWithSuffix(supportedValues, mediaType, otherAttriutes);
};

export const createContentTypeNegotiator = (supportedValues: Array<string>): Negotiator => {
  return {
    negotiate: (header: string) => {
      const headerToMap = resolveHeaderToMap(header);

      return compareMediaTypes(supportedValues, headerToMap);
    },
    supportedValues,
  };
};
