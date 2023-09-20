import { createModuleDef, PipesCoreModule, Simplify, Container } from './pipes-core.js';

interface IPipesNodeConfig {
    nodeVersion: "AUTO" | string;
    nodeWorkDir: string;
    nodeSourceDir: string;
    nodeSourceIncludeOrExclude: "include" | "exclude" | "include-and-exclude";
    nodeSourceExclude: string[];
    nodeSourceInclude: string[];
    nodeImageKey: string;
}
interface IPipesNodeContext {
    nodeAddEnv: (prop: {
        container?: Container;
        env: [string, string][];
    }) => Promise<Container>;
    nodeGetVersion: () => Promise<string>;
    nodeGetContainer: () => Promise<Container>;
    nodePrepareContainer: () => Promise<Container>;
    nodeCompileAndRun: (props: {
        file: string;
        name: string;
        external: string[];
        container?: Container;
        output?: {
            output: "stdout";
        } | {
            output: "stderr";
        } | {
            file: string;
        } | {
            fileFromEnv: string;
        };
    }) => Promise<{
        error?: true | unknown;
        message: string;
        container: Container | null;
    }>;
}
type PipesNodeModule = createModuleDef<"PipesNode", IPipesNodeContext, IPipesNodeConfig, [PipesCoreModule]>;
declare const PipesNode: {
    name: "PipesNode";
    config: Simplify<PipesNodeModule["Config"]["Implement"]>;
    context: Simplify<PipesNodeModule["Context"]["Implement"]>;
    required: "PipesCore"[];
    optional: [];
};

export { PipesNode, type PipesNodeModule };
