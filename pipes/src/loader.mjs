import { builtinModules } from "node:module";
import { join, sep, dirname, extname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { transformFile } from "@swc/core";
import * as fs from "node:fs/promises";
import { readFile } from "node:fs/promises";
import { glob } from "glob";
import { readFile as readFile$1 } from "node:fs/promises";
import { join as join$1 } from "path";

const getAllWorkspaces = async (root) => {
  // Get workspaces
  const json = JSON.parse(await readFile(join(root, "package.json"), "utf-8"));
  const jsonWorkspaces = json.workspaces.map((e) => {
    return join(root, ...e.split("/"), "package.json");
  });
  const projects = {};
  const values = (
    await Promise.all(
      (await glob(jsonWorkspaces)).map(async (e) => {
        const content = JSON.parse(await readFile(e, "utf-8"));
        const relative = "source" in content ? content.source : content.dist;
        if (!relative) {
          return null;
        }
        const workspaceRoot = e.replace(`package.json`, "");
        const absolutePath = `${sep}${join(...workspaceRoot.split(sep), ...relative.split("/"))}`;
        const name = content.name;
        return {
          name: name,
          source: absolutePath,
        };
      }),
    )
  ).filter((e) => !!e);
  for (const value of values) {
    projects[value.name] = value;
  }
  return projects;
};

let obj = null;
const getLocalPackageScoop = async (rootPath) => {
  if (typeof obj === "string") {
    return obj;
  }
  const file = join$1(rootPath, ".yarnrc.yml");
  const data = await readFile$1(file, "utf-8");
  const content = data.match(/initScope:(.*)\n/g);
  if (!content || !content[0]) {
    throw new Error("Could not find initScope");
  }
  const initScope = `@${content[0].replaceAll("initScope:", "").replaceAll(" ", "").trim()}/`;
  obj = initScope;
  return initScope;
};

const allowed_extension = [".ts", ".tsx"];
const allowed_other_extensions = [".js", ".jsx", ".mjs", ".cjs", ".json"];
const root = process.env["PIPES_PROJECT_ROOT"];
const should_use_source_extension_for_local_packages =
  process.env["PIPES_LOCAL_DEV"] === "true" && typeof process.env["PIPES_PROJECT_ROOT"] !== "undefined";
const localScope = should_use_source_extension_for_local_packages ? await getLocalPackageScoop(root) : "@@@@@@@@";
const localProjects = should_use_source_extension_for_local_packages ? await getAllWorkspaces(root) : {};

const getPackageType = async (path) => {
  try {
    const file = await fs.readFile(join(path, "./package.json"), "utf-8");
    const content = JSON.parse(file);
    if (!("type" in content)) {
      return "commonjs";
    }
    return content["type"] === "module" ? "module" : "commonjs";
  } catch {
    return getPackageType(dirname(path));
  }
};

const load = async (url, context, defaultLoad) => {
  if (builtinModules.includes(url) || url.startsWith("node")) {
    return defaultLoad(url, context, defaultLoad);
  }
  if (!allowed_extension.includes(extname(url)) && allowed_other_extensions.includes(extname(url))) {
    return defaultLoad(url, context, defaultLoad);
  }
  if (!allowed_extension.includes(extname(url))) {
    const filePath = fileURLToPath(url);
    const moduleType = await getPackageType(filePath);
    return {
      source: await fs.readFile(filePath),
      format: moduleType,
      shortCircuit: true,
    };
  }
  /** Transpile all code that ends with ts or tsx */ const { code } = await transformFile(fileURLToPath(url), {
    cwd: process.cwd(),
    jsc: {
      target: "esnext",
      parser: {
        syntax: "typescript",
        dynamicImport: true,
      },
      transform: {
        react: {
          pragma: "React.createElement",
          pragmaFrag: "React.Fragment",
          throwIfNamespace: true,
          development: false,
          useBuiltins: false,
        },
      },
    },
    sourceMaps: "inline",
    module: {
      type: "nodenext",
      strict: true,
    },
  });
  return {
    format: "module",
    shortCircuit: true,
    source: code,
  };
};

/**
 * Converts string from file URL to path if needed.
 *
 * @param file File path or URL string
 * @returns null if wrong protocool, else string.
 */ function convertURL(file) {
  if (!file) {
    return null;
  }
  try {
    const url = new URL(file);
    if (url.protocol !== "file:") {
      return null;
    }
    return fileURLToPath(url);
  } catch {
    // empty on purpose
  }
  return file;
}

const isRelativePath = (path) => {
  return !/^(?:\/|[a-zA-Z]:\\|https?:\/\/|data:|blob:)/.test(path);
};

/**
 * Returns absolute path.
 * @param path path to file
 * @param parent path to parent
 * @returns string - absolute path
 */ const convertFilePath = (path, parent) => {
  const filePath = convertURL(path);
  if (!filePath) {
    throw new Error("Invalid url!");
  }
  if (filePath && isRelativePath(filePath)) {
    return join(parent || process.cwd(), filePath);
  }
  return filePath;
};

/**
 * @param path - path in the fs.
 */ const isDirectory = async (path) => {
  try {
    const stat = await fs.stat(path);
    return stat.isDirectory();
  } catch (error) {
    return false;
  }
};

/**
 * Checks if the string is a file or directory. Returns directory.
 * @param url fs location
 * @returns null if no directory found or string. Returns dirname of file if file, else path.
 */ async function convertURLToDirectory(url) {
  if (!url) {
    return null;
  }
  const path = convertURL(url);
  if (!path) {
    return null;
  }
  if (await isDirectory(path)) {
    return path;
  }
  const rootDirectory = dirname(path);
  if (await isDirectory(rootDirectory)) {
    return rootDirectory;
  }
  return null;
}

/**
 * @param path - path to fs
 * @returns true if file exists, else false.
 */ async function doesFileExists(path) {
  try {
    await fs.access(path, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Checks if the file is ts, tsx or has a typescript file with different ending
 * @param path path to fs
 * @returns string if it exists else null
 */ async function shouldCompile(path) {
  const fileIsHere = await doesFileExists(path);
  if (fileIsHere) {
    const currentExtension = extname(path);
    if (allowed_extension.includes(currentExtension)) {
      return path;
    }
    return null;
  }
  for (const extension of allowed_extension) {
    const newPath = path.replace(/(\.[^.]+)$/, extension);
    const newFileExists = await doesFileExists(newPath);
    if (newFileExists) {
      return newPath;
    }
  }
  return null;
}

const resolve = async (url, context, nextResolve) => {
  /** Ignore builtin modules. */ if (url.startsWith("node:") || builtinModules.includes(url)) {
    return nextResolve(url, context, nextResolve);
  }
  /** If we are in source mode and this is a local package - fetch it! */ if (
    should_use_source_extension_for_local_packages &&
    url.startsWith(localScope)
  ) {
    const obj = localProjects[url];
    if (obj) {
      return {
        url: pathToFileURL(obj.source).href,
        shortCircuit: true,
      };
    }
  }
  /**
   * 1. parentURL
   * Check if parentURL is defined || Set process.cwd() as parentURL
   * Convert parentURL from URL to string - if needed
   * Check if parentURL is file or directory - use dirname if file
   * 2. filePath
   * Convert filePath from URL to string - if needed
   * Join with parentURL if it is a relative path.
   */ const parentURL = await convertURLToDirectory(context?.parentURL);
  const filePath = convertFilePath(url, parentURL);
  /**
   * Compile if:
   * a) the file exists and has a .ts .tsx ending
   * b) the file does not exist but a file with .ts .tsx ending does
   */ const compileFile = await shouldCompile(filePath);
  /** Ignore files who do not meet those conditions */ if (!compileFile && (await doesFileExists(filePath))) {
    const fileIsDirectory = await isDirectory(filePath);
    if (!fileIsDirectory) {
      return nextResolve(url, context, nextResolve);
    }
    return nextResolve(url, context, nextResolve);
  }
  if (!compileFile) {
    return nextResolve(url, context, nextResolve);
  }
  /** Tell nodejs to compile! */ return {
    url: pathToFileURL(compileFile).href,
    shortCircuit: true,
  };
};

export { load, resolve };
