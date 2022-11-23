import * as estree from 'estree';
export declare namespace Mocha {
    interface TestCase {
        node: estree.Node;
        callback: estree.Function;
    }
    function isTestConstruct(node: estree.Node, constructs?: string[]): boolean;
    function extractTestCase(node: estree.Node): TestCase | null;
    function isTestCase(node: estree.Node): boolean;
}
