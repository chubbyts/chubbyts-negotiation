import type { NegotiatedValue, Negotiator } from './negotiation.js';
import { resolveHeaderToMap } from './negotiation.js';

const escapeStringRegexp = (regex: string): string => {
  return regex.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const compareMediaTypeWithTypeOnly = (
  supportedValues: Array<string>,
  mediaType: string,
  attributes: Record<string, string>,
): NegotiatedValue | undefined => {
  const mediaTypeParts = mediaType.match(/([^/+]+)\/\*/);

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
  headerToMap: Map<string, Record<string, string>>,
): NegotiatedValue | undefined => {
  for (const [mediaType, attributes] of headerToMap.entries()) {
    if (-1 !== supportedValues.indexOf(mediaType)) {
      return { value: mediaType, attributes };
    }
  }

  for (const [mediaType, attributes] of headerToMap.entries()) {
    if (suffixSupportedValues.has(mediaType)) {
      return { value: suffixSupportedValues.get(mediaType) as string, attributes };
    }
  }

  for (const [mediaType, attributes] of headerToMap.entries()) {
    const negotiatedValue = compareMediaTypeWithTypeOnly(supportedValues, mediaType, attributes);

    if (undefined !== negotiatedValue) {
      return negotiatedValue;
    }
  }

  if (headerToMap.has('*/*')) {
    return { value: supportedValues[0], attributes: headerToMap.get('*/*') as Record<string, string> };
  }

  return undefined;
};

export const createAcceptNegotiator = (supportedValues: Array<string>): Negotiator => {
  const suffixSupportedValues = new Map(
    supportedValues.map((supportedValue) => {
      const supportedValueParts = supportedValue.match(/([^/+]+)\/([^/+]+)\+([^/+]+)/);

      return [
        null !== supportedValueParts ? supportedValueParts[1] + '/' + supportedValueParts[3] : undefined,
        supportedValue,
      ];
    }),
  );

  return {
    negotiate: (header: string) => {
      const headerToMap = resolveHeaderToMap(header);

      return compareMediaTypes(supportedValues, suffixSupportedValues, headerToMap);
    },
    supportedValues,
  };
};
