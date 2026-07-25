import type { NegotiatedValue, Negotiator } from './negotiation.js';
import { resolveHeaderToMap } from './negotiation.js';

const compareMediaTypeWithTypeOnly = (
  supportedValues: Array<string>,
  mediaType: string,
  attributes: Record<string, string>,
): NegotiatedValue | undefined => {
  if (!mediaType.endsWith('/*')) {
    return undefined;
  }

  const typePrefix = mediaType.slice(0, -1);

  for (const supportedValue of supportedValues) {
    if (supportedValue.startsWith(typePrefix)) {
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
    if (supportedValues.includes(mediaType)) {
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
      const [type, subtypeWithSuffix] = supportedValue.split('/');
      const suffix = subtypeWithSuffix?.split('+')[1];

      return [undefined !== suffix ? type + '/' + suffix : undefined, supportedValue];
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
