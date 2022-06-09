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
        const headerValueParts = headerValue.split(';');
        const locale = (headerValueParts.shift() as string).trim();
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

        return [locale, attributes];
      })
      .filter(([locale]) => locale !== '')
      .sort((a, b) => b[1]['q'].localeCompare(a[1]['q'])),
  );
};
