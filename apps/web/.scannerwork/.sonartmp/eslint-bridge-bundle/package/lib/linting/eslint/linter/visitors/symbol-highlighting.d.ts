import { Rule } from 'eslint';
import { Location } from './metrics/helpers';
/**
 * A symbol highlight
 *
 * @param declaration the location where the symbol is declared
 * @param references the locations where the symbol is referenced
 */
export interface SymbolHighlight {
    declaration: Location;
    references: Location[];
}
/**
 * A rule for computing the symbol highlighting of the source code
 *
 * We use an ESLint rule as we need to access declared variables which
 * are only available only through the rule context.
 */
export declare const rule: Rule.RuleModule;
