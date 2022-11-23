import { Linter, SourceCode } from 'eslint';
import { QuickFix } from './quickfix';
/**
 * Transforms ESLint fixes and suggestions into SonarLint quick fixes
 * @param source the source code
 * @param messages the ESLint messages to transform
 * @returns the transformed quick fixes
 */
export declare function transformFixes(source: SourceCode, messages: Linter.LintMessage): QuickFix[];
