export type NegotiatedValue = {
  value: string;
  attributes: Record<string, string>;
};

export type Negotiator = {
  negotiate: (header: string) => NegotiatedValue | undefined;
  supportedValues: Array<string>;
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
      .sort((a, b) => b[1]['q'].localeCompare(a[1]['q'])),
  );
};
