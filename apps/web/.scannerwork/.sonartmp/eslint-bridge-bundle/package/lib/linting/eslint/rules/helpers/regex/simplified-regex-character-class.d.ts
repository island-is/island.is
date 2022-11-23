import { CharacterClassElement, Flags, Node } from 'regexpp/ast';
import * as regexpp from 'regexpp';
import createTree from 'functional-red-black-tree';
export declare class SimplifiedRegexCharacterClass {
    private readonly flags;
    /**
     * This map defines the contents of the character class in the following way:<br>
     * For any entry {@code codepoint -> tree}, all the codepoints from {@code codepoint} up to (and excluding) the next
     * entry are in the character class and belong to the given tree.<br>
     * For any entry {@code codepoint -> null}, all the codepoints from {@code codepoint} up to (and excluding) the next
     * entry are not part of the character class.<br>
     * So a codepoint is contained in this class if and only if {@code contents.le(codePoint).value} is
     * non-null and the tree returned by {@code value} will be the element of the character class which matches that
     * code point.
     */
    private contents;
    constructor(flags: Flags, element?: CharacterClassElement);
    add(element: CharacterClassElement): void;
    findIntersections(that: SimplifiedRegexCharacterClass): Node[];
    hasEntryBetween(from: number, to: number): boolean | Node;
    isRangeEmpty(from: number, to: number): boolean;
    addRange(from: number, to: number, element: CharacterClassElement): void;
    put(key: number, value: Node | undefined, tree: createTree.Tree<number, regexpp.AST.Node | undefined>): createTree.Tree<number, Node | undefined>;
    private static readonly Builder;
}
