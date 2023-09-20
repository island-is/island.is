import { join as join$1, basename } from 'node:path/posix';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createConfig, createContext, Container, createModule } from './pipes-core.js';
import { builtinModules } from 'node:module';
import { rollup } from 'rollup';
import { swc } from 'rollup-plugin-swc3';
import { file } from 'tmp-promise';

const baseDir$1 = {};
// This returns the base dir of the project.
const findPnpRoot = (path)=>{
    if (baseDir$1[path]) {
        return baseDir$1[path];
    }
    const file = existsSync(join(path, "yarn.lock"));
    if (file) {
        baseDir$1[path] = path;
        return path;
    }
    const newPath = join(path, "..");
    if (path === newPath) {
        throw new Error("Could not find root");
    }
    const basePath = findPnpRoot(newPath);
    baseDir$1[path] = basePath;
    return basePath;
};

const baseDir = {};
const getNvmVersion = (root = process.cwd())=>{
    const path = findPnpRoot(root);
    if (baseDir[path]) {
        return baseDir[path];
    }
    let version = null;
    [
        ".nvmrc",
        ".node-version"
    ].map((file)=>{
        return ()=>{
            const nvmrc = join(path, file);
            try {
                return readFileSync(nvmrc, "utf-8");
            } catch (_e) {
                return null;
            }
        };
    }).find((fn)=>{
        const value = fn();
        if (value != null) {
            version = value;
            return true;
        }
        return false;
    });
    if (version && typeof version === "string") {
        baseDir[path] = version.trim();
        return baseDir[path];
    }
    throw new Error("Not found");
};

const nodeResolve = (await import('rollup-plugin-node-resolve')).default;
async function compileFile(inputFile, additionalExternals = [], name) {
    const { path: tmpFilePath } = await file({
        prefix: name,
        postfix: ".mjs"
    });
    const config = {
        input: inputFile,
        output: {
            file: tmpFilePath,
            format: "esm"
        },
        // @ts-expect-error - wrong typing
        plugins: [
            nodeResolve({
                only: []
            }),
            swc({
                minify: false
            })
        ],
        external: [
            ...builtinModules,
            ...builtinModules.map((e)=>`node:${e}`),
            ...additionalExternals
        ]
    };
    const bundle = await rollup(config);
    await bundle.write(config.output);
    await bundle.close();
    return tmpFilePath;
}

const PipesNodeConfig = createConfig(({ z })=>({
        nodeImageKey: z.string().default("node-dev"),
        nodeWorkDir: z.string().default("/apps"),
        nodeSourceDir: z.string().default(process.cwd()),
        nodeSourceIncludeOrExclude: z.union([
            z.literal("include"),
            z.literal("exclude"),
            z.literal("include-and-exclude")
        ]).default("exclude"),
        nodeSourceInclude: z.array(z.string()).default([]),
        nodeSourceExclude: z.array(z.string()).default([
            ".env*",
            "**/node_modules",
            "node_modules",
            ".yarn/cache",
            ".yarn/install-state.gz",
            ".yarn/unplugged"
        ]),
        nodeVersion: z.string().default("AUTO")
    }));
const PipesNodeContext = createContext(({ z, fn })=>({
        nodeAddEnv: fn({
            value: z.object({
                container: z.custom().optional(),
                env: z.array(z.tuple([
                    z.string(),
                    z.string()
                ]))
            }),
            output: z.custom((val)=>val),
            implement: async (context, config, { container, env })=>{
                const imageStore = await context.imageStore;
                const usedContainer = container || await imageStore.awaitForAvailability(`node-${config.nodeImageKey}`);
                const newContainer = context.addEnv({
                    container: usedContainer,
                    env
                });
                return newContainer;
            }
        }),
        nodeCompileAndRun: fn({
            value: z.object({
                container: z.custom().optional(),
                file: z.string(),
                name: z.string(),
                output: z.union([
                    z.object({
                        output: z.literal("stdout")
                    }),
                    z.object({
                        output: z.literal("stderr")
                    }),
                    z.object({
                        file: z.string()
                    }),
                    z.object({
                        fileFromEnv: z.string()
                    })
                ]).default({
                    output: "stdout"
                }).optional(),
                external: z.array(z.string()).default([]),
                env: z.record(z.string(), z.string()).default({})
            }),
            output: z.custom((val)=>{
                return val;
            }),
            implement: async (context, config, { container, name, file, external, output = {
                output: "stdout"
            } })=>{
                let value;
                const getMessage = async (messageContainer)=>{
                    if (!messageContainer) {
                        throw new Error("Container unassigned");
                    }
                    if ("output" in output) {
                        if (output.output === "stdout") {
                            return messageContainer.stdout();
                        }
                        if (output.output === "stderr") {
                            return messageContainer.stderr();
                        }
                    }
                    if ("file" in output) {
                        const outputFile = (await messageContainer.file(output.file).sync()).contents();
                        return outputFile;
                    }
                    if ("fileFromEnv" in output) {
                        const fileName = await messageContainer.envVariable(output.fileFromEnv);
                        const outputFile = await (await messageContainer.file(fileName).sync()).contents();
                        return outputFile;
                    }
                    // Default behaviour
                    return messageContainer.stdout();
                };
                try {
                    const tmpFile = await compileFile(file, external, name);
                    const imageStore = await context.imageStore;
                    value = await (container ?? imageStore.awaitForAvailability(`node-${config.nodeImageKey}`));
                    const tmpFileRef = context.client.host().file(tmpFile);
                    value = await (await value.withWorkdir(config.nodeWorkDir).withFile(join$1(config.nodeWorkDir, basename(tmpFile)), tmpFileRef).withExec([
                        "yarn",
                        "node",
                        basename(tmpFile)
                    ]).sync()).withExec([
                        "rm",
                        basename(tmpFile)
                    ]).sync();
                    return {
                        message: await getMessage(value),
                        container: value
                    };
                } catch (e) {
                    const message = await (()=>{
                        try {
                            /* @ts-expect-error - this could been unassigned */ return getMessage(value);
                        } catch  {
                            return `Error occured with ${file} using prefix: ${name}`;
                        }
                    })();
                    return {
                        error: e,
                        message,
                        container: null
                    };
                }
            }
        }),
        nodeGetVersion: fn({
            value: undefined,
            output: z.custom((val)=>{
                // FIX PROMISE VALIDATION
                return val;
            }),
            implement: async (_context, config)=>{
                if (config.nodeVersion === "AUTO") {
                    // TODO move to async:
                    const nodeVersion = await getNvmVersion(config.nodeSourceDir);
                    config.nodeVersion = nodeVersion;
                }
                // No need to call this again. The version has been set for the context.
                return config.nodeVersion;
            }
        }),
        nodePrepareContainer: fn({
            output: z.promise(z.custom((val)=>{
                if (val instanceof Container) {
                    return val;
                }
                throw new Error(`Invalid value`);
            })),
            implement: async (context, config)=>{
                return (await context.imageStore).getOrSet(`node-${config.nodeImageKey}`, async ()=>{
                    const container = await context.nodeGetContainer();
                    const sourceOptions = {
                        ...config.nodeSourceIncludeOrExclude === "include" || config.nodeSourceIncludeOrExclude === "include-and-exclude" ? {
                            include: config.nodeSourceInclude
                        } : {},
                        ...config.nodeSourceIncludeOrExclude === "exclude" || config.nodeSourceIncludeOrExclude === "include-and-exclude" ? {
                            exclude: config.nodeSourceExclude
                        } : {}
                    };
                    // Currently we are just using yarn
                    const source = context.client.host().directory(config.nodeSourceDir, sourceOptions);
                    const corepack = await container.withDirectory(config.nodeWorkDir, source).withWorkdir(config.nodeWorkDir).withExec([
                        "ls",
                    ]).sync();
                    /* const yarnInstall = await corepack.withExec([
                        "yarn",
                        "install"
                    ]).sync(); */
                    return corepack;
                });
            }
        }),
        nodeGetContainer: fn({
            output: z.promise(z.custom((val)=>{
                if (val instanceof Container) {
                    return val;
                }
                throw new Error(`Invalid value`);
            })),
            implement: async (context, _config)=>{
                const version = await context.nodeGetVersion();
                return (await context.imageStore).getOrSet(`base-node-${version}`, ()=>{
                    const container = context.client.container().from(`node:${version}`);
                    return container;
                });
            }
        })
    }));
const PipesNode = createModule({
    name: "PipesNode",
    config: PipesNodeConfig,
    context: PipesNodeContext,
    required: [
        "PipesCore"
    ]
});

export { PipesNode };
//# sourceMappingURL=pipes-module-node.js.map
