import { ServerRequest } from '@chubbyts/chubbyts-http-types/dist/message';

export type NegotiatedValue = {
  value: string;
  attributes: Record<string, string>;
};

export type Negotiator = {
  negotiate: (request: ServerRequest) => NegotiatedValue | undefined;
  supportedValues: Array<string>;
};
