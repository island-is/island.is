/**
 * An extracted embedded JavaScript code snippet from a YAML file
 *
 * @param code JS code
 * @param line Line where JS code starts
 * @param column Column where JS code starts
 * @param offset Offset where JS code starts
 * @param lineStarts Offset at each line start
 * @param text Whole YAML file content
 * @param format Format of the YAML string that embeds the JS code
 * @param extras Additionnal data, filled by ExtrasPicker
 */
export declare type EmbeddedJS = {
    code: string;
    line: number;
    column: number;
    offset: number;
    lineStarts: number[];
    text: string;
    format: 'PLAIN' | 'BLOCK_FOLDED' | 'BLOCK_LITERAL';
    extras: {
        resourceName?: string;
    };
};
