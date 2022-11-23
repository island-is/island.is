import { ParsingContext } from 'parsing/yaml';
export declare const lambdaParsingContext: ParsingContext;
export declare const serverlessParsingContext: ParsingContext;
/**
 * Picks the embeddedJS resource name for AWS lambdas and serverless functions
 */
export declare function pickResourceName(level: number, _key: any, _pair: any, ancestors: any): {
    resourceName: any;
};
