/**
 * Extracts from a YAML file all the embedded JavaScript code snippets either
 * in AWS Lambda Functions or AWS Serverless Functions.
 */
export declare const parseAwsFromYaml: (filePath: string) => import("parsing/yaml/parser").EmbeddedJS[];
