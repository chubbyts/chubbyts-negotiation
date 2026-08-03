import type { NegotiatedValue, Negotiator } from './negotiation.js';
import {
  resolveAcceptableAndRefused,
  resolveExactMatch,
  resolveHeaderToMap,
  resolveWildcardMatch,
} from './negotiation.js';

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
  const { acceptableEntries, refusedValues } = resolveAcceptableAndRefused(headerToMap);

  const isRefusedExactly = (supportedValue: string): boolean => refusedValues.includes(supportedValue);

  const isRefusedBySuffix = (supportedValue: string): boolean =>
    refusedValues.some((mediaType) => suffixSupportedValues.get(mediaType) === supportedValue);

  const isRefusedByTypeOnly = (supportedValue: string): boolean =>
    refusedValues.some((mediaType) => mediaType.endsWith('/*') && supportedValue.startsWith(mediaType.slice(0, -1)));

  const exactMatch = resolveExactMatch(supportedValues, acceptableEntries);

  if (undefined !== exactMatch) {
    return exactMatch;
  }

  for (const [mediaType, attributes] of acceptableEntries) {
    const suffixSupportedValue = suffixSupportedValues.get(mediaType);

    if (undefined !== suffixSupportedValue && !isRefusedExactly(suffixSupportedValue)) {
      return { value: suffixSupportedValue, attributes };
    }
  }

  const supportedValuesForTypeOnly = supportedValues.filter(
    (supportedValue) => !isRefusedExactly(supportedValue) && !isRefusedBySuffix(supportedValue),
  );

  for (const [mediaType, attributes] of acceptableEntries) {
    const negotiatedValue = compareMediaTypeWithTypeOnly(supportedValuesForTypeOnly, mediaType, attributes);

    if (undefined !== negotiatedValue) {
      return negotiatedValue;
    }
  }

  return resolveWildcardMatch('*/*', acceptableEntries, supportedValuesForTypeOnly, isRefusedByTypeOnly);
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
