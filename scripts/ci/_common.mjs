import { readFile } from "node:fs/promises";
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = resolve(__dirname, "..", "..");

export async function getPackageJSON(filePath = resolve(ROOT, "package.json")) {
    const content = JSON.parse(await readFile(filePath, 'utf-8'));
    return content;
}  

