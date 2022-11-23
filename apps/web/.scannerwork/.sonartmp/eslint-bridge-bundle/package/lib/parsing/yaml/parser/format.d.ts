/**
 * YAML string formats given by the YAML parser
 */
export declare const PLAIN_FORMAT: string, BLOCK_FOLDED_FORMAT: string, BLOCK_LITERAL_FORMAT: string;
/**
 * The list of supported YAML string formats
 */
export declare const SUPPORTED_STRING_FORMATS: string[];
/**
 * Checks if the node denotes a supported YAML string format
 */
export declare function isSupportedFormat(pair: any): boolean;
