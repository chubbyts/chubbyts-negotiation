import { ServerRequest } from '@chubbyts/chubbyts-http-types/dist/message';
import { NegotiatedValue, Negotiator } from './negotiation';

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

const compareMediaTypes = (supportedValues: Array<string>, header: string): NegotiatedValue | undefined => {
  if (-1 !== header.search(/,/)) {
    return undefined;
  }

  const headerValueParts = header.split(';');
  const mediaType = (headerValueParts.shift() as string).trim();
  const attributes: Record<string, string> = Object.fromEntries(
    headerValueParts.map((attribute: string) => {
      const [attributeKey, attributeValue] = attribute.split('=');
      return [attributeKey.trim(), attributeValue.trim()];
    }),
  );

  if (-1 !== supportedValues.indexOf(mediaType)) {
    return { value: mediaType, attributes };
  }

  return compareMediaTypeWithSuffix(supportedValues, mediaType, attributes);
};

export const createContentTypeNegotiator = (supportedValues: Array<string>): Negotiator => {
  return {
    negotiate: (request: ServerRequest) => {
      const contentType = request.headers['content-type'];

      if (!contentType || contentType.length > 1) {
        return undefined;
      }

      return compareMediaTypes(supportedValues, contentType[0]);
    },
    supportedValues,
  };
};
