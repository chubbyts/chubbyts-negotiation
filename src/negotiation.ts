import { ServerRequest } from '@chubbyts/chubbyts-http-types/dist/message';

export type NegotiatedValue = {
  value: string;
  attributes: Record<string, string>;
};

export type Negotiator = (request: ServerRequest) => NegotiatedValue | undefined;
