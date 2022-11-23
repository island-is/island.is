import { EmbeddedJS } from './embedded-js';
/**
 * A bundle of Yaml visitor predicate and Extras picker
 * We have bundled these together because they depend on each other
 * and should be used in pairs
 */
export declare type ParsingContext = {
    predicate: YamlVisitorPredicate;
    picker: ExtrasPicker;
};
/**
 * A function predicate to select a YAML node containing JS code
 */
export declare type YamlVisitorPredicate = (key: any, node: any, ancestors: any) => boolean;
/**
 * A function that picks extra data to save in EmbeddedJS
 */
export declare type ExtrasPicker = (key: any, node: any, ancestors: any) => {};
/**
 * Parses YAML file and extracts JS code according to the provided predicate
 */
export declare function parseYaml(parsingContexts: ParsingContext[], filePath: string): EmbeddedJS[];
