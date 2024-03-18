import { ProjectGraphExternalNode, runExecutor } from '@nx/devkit'
import type { ExecutorContext } from '@nx/devkit'
import { getExtraDependencies } from '@nx/esbuild/src/executors/esbuild/lib/get-extra-dependencies';
type DependentBuildableProjectNode = ReturnType<typeof getExtraDependencies>[number] & {node: ProjectGraphExternalNode};


import {exec as _exec} from "child_process";
import {readFile, writeFile} from "fs/promises";
import { glob } from 'glob'; 
import {resolve} from "path";
import {promisify} from "util";

const exec = promisify(_exec);

export interface BuildExecutorOptions {
    appRoot: string;
    distRoot: string;
    sourceRoot: string;
    tsConfig: string;
}

/**
 * Build e2e tests
 * generate package.json
 * generate lock file
 */
export default async function* buildExecutor(
    options: BuildExecutorOptions,
    context: ExecutorContext,

  ): AsyncIterableIterator<unknown> { 
    const { distRoot, sourceRoot, tsConfig } = options
    const { projectName, projectGraph } = context

    if (!projectName) {
        throw new Error(`No Project name found`);
    }
    if (!projectGraph) {
        throw new Error(`No Project Graph found`);
    }
    const nodeDeps = getExtraDependencies(projectName, projectGraph).filter((e) => e.node.type === "npm") as DependentBuildableProjectNode[];

    const depsObj = nodeDeps.reduce((a, b) => {
        return {
            ...a,
            [b.node.data.packageName]: b.node.data.version
        }
    }, {} as Record<string, string>)

    const externalDeps = Object.keys(depsObj).map((pkg) => `--external:${pkg}`);

    const pattern = `${sourceRoot}/**/*.ts`;
    const optionsForGlob = { ignore: ['**/node_modules/**', '**/*.d.ts'] };

    const entryPoints = await glob(pattern, optionsForGlob);
    
    await exec(["yarn", "esbuild", "--bundle", ...entryPoints, `--tsconfig=${tsConfig}`, `--outdir=${distRoot}`, '--platform=node', ...externalDeps].join(" "), {
        encoding: 'utf-8',
    });

    const rootPackageJson = JSON.parse(await readFile('package.json', 'utf-8'));
    const packageManager = rootPackageJson.packageManager as string;

    /** Force same resolultions as in base package.json */
    const resolutions = Object.keys(rootPackageJson.resolutions as Record<string, string>).reduce((a, b) => {
        if (!Object.keys(depsObj).includes(b)) {
            return a;
        }

        const res = rootPackageJson.resolutions[b];
        if (res.startsWith("patch:")) {
            throw new Error("Patch not implemented");
        }
        return {
            ...a,
            [b]: rootPackageJson.resolutions[b]
        }
    }, {} as Record<string, string>);    

    // Write package.json file
    const pkgJson = {
        name: projectName,
        version: projectGraph.version,
        dependencies: depsObj,
        packageManager,
        resolutions,
    }

    const packageJSONPath = resolve(distRoot, "package.json");
    await writeFile(packageJSONPath, JSON.stringify(pkgJson, null, 2));

    const yarnLockPath = resolve(distRoot, "yarn.lock");
    await writeFile(yarnLockPath, await readFile("yarn.lock", "utf-8"))

    const distDir = resolve(process.cwd(), distRoot);

    // update lock file 
    await exec(["yarn", "--mode=update-lockfile"].join(" "), {
        encoding: 'utf-8',
        env: {
            ...process.env,
            // To force recration of yarn lock file
            YARN_ENABLE_IMMUTABLE_INSTALLS: "false"
        },
        cwd: distDir,
    });
    
    return {
        success: true
    }
};
