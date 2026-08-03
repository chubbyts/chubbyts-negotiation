export type NegotiatedValue = {
  value: string;
  attributes: Record<string, string>;
};

export type Negotiator = {
  negotiate: (header: string) => NegotiatedValue | undefined;
  supportedValues: Array<string>;
};

export type HeaderEntry = [string, Record<string, string>];

// qvalue = ( "0" [ "." 0*3DIGIT ] ) / ( "1" [ "." 0*3("0") ] ) - RFC 9110 12.4.2
// only the "0" alternative needs matching: any "1" form and any invalid value - garbage
// must not become a q=0 refusal by accident - resolve to 1 either way, as does a
// missing q, which stringifies to 'undefined' and fails the regex
const qualityRegex = /^0(\.\d{0,3})?$/;

export const resolveQuality = (attributes: Record<string, string>): number => {
  const quality = attributes['q'];

  if (!qualityRegex.test(quality)) {
    return 1;
  }

  return Number.parseFloat(quality);
};

export const resolveHeaderToMap = (header: string): Map<string, Record<string, string>> => {
  return new Map(
    header
      .split(',')
      .map((headerValue): [string, Record<string, string>] => {
        const [notTrimmedName, ...notSplittedAttributes] = headerValue.split(';');
        const name = notTrimmedName.trim();
        const attributes: Record<string, string> = Object.fromEntries(
          notSplittedAttributes
            .filter((attribute) => -1 !== attribute.search(/=/))
            .map((attribute): [string, string] => {
              const [attributeKey, attributeValue] = attribute.split('=');

              return [attributeKey.trim(), attributeValue.trim()];
            }),
        );

        return [name, { ...attributes, q: attributes['q'] ?? '1.0' }];
      })
      .filter(([locale]) => locale !== '')
      // oxlint-disable-next-line unicorn/no-array-sort
      .sort((a, b) => resolveQuality(b[1]) - resolveQuality(a[1])),
  );
};

// q=0 means "not acceptable" (RFC 9110 12.4.2): such entries never match
// and veto any less specific match on the same supported value
export const resolveAcceptableAndRefused = (
  headerToMap: Map<string, Record<string, string>>,
): { acceptableEntries: Array<HeaderEntry>; refusedValues: Array<string> } => {
  const entries = Array.from(headerToMap.entries());

  return {
    acceptableEntries: entries.filter(([, attributes]) => 0 !== resolveQuality(attributes)),
    refusedValues: entries.filter(([, attributes]) => 0 === resolveQuality(attributes)).map(([value]) => value),
  };
};

export const resolveExactMatch = (
  supportedValues: Array<string>,
  acceptableEntries: Array<HeaderEntry>,
): NegotiatedValue | undefined => {
  for (const [value, attributes] of acceptableEntries) {
    if (supportedValues.includes(value)) {
      return { value, attributes };
    }
  }

  return undefined;
};

export const resolveWildcardMatch = (
  wildcard: string,
  acceptableEntries: Array<HeaderEntry>,
  supportedValues: Array<string>,
  isRefused: (supportedValue: string) => boolean,
): NegotiatedValue | undefined => {
  const wildcardEntry = acceptableEntries.find(([value]) => wildcard === value);

  if (undefined === wildcardEntry) {
    return undefined;
  }

  const supportedValue = supportedValues.find((value) => !isRefused(value));

  if (undefined === supportedValue) {
    return undefined;
  }

  return { value: supportedValue, attributes: wildcardEntry[1] };
};
