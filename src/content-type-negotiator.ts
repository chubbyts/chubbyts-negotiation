import type { NegotiatedValue, Negotiator } from './negotiation.js';
import { resolveHeaderToMap } from './negotiation.js';

const compareMediaTypeWithSuffix = (
  supportedValues: Array<string>,
  mediaType: string,
  attributes: Record<string, string>,
): NegotiatedValue | undefined => {
  const [type, subtypeWithSuffix] = mediaType.split('/');
  const suffix = subtypeWithSuffix?.split('+')[1];

  const mediaTypeFromParts = `${type}/${suffix}`;

  if (supportedValues.includes(mediaTypeFromParts)) {
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
  const { q: _, ...otherAttriutes } = attributes;

  if (supportedValues.includes(mediaType)) {
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
