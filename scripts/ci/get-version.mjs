#!/usr/bin/env node
import { readFile } from 'fs/promises';
import fetch from 'node-fetch';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..");

async function getVersion(version, withAlpine = true, architecture = 'amd64', url = null) {
  // const baseURL = 'https://hub.docker.com/v2/repositories/library/node/tags';
  try {
    const baseURL = url ?? 'https://hub.docker.com/v2/repositories/library/node/tags?page_size=100'
    const response = await fetch(baseURL); // Increased page size to ensure more tags are fetched
    const data = await response.json();

    const filteredTags = data.results.filter((tag) => {
      const isVersionMatch = tag.name.startsWith(version); // Using startsWith to ensure exact version match at the beginning
      const isAlpine = withAlpine ? tag.name.includes('alpine') : true;
      const isArchitectureMatch = tag.images.some((image) => image.architecture === architecture);
      return isVersionMatch && isAlpine && isArchitectureMatch;
    });

    const latestTag = filteredTags.sort((a, b) => b.last_updated.localeCompare(a.last_updated))[0];

    if (latestTag) {
      return latestTag.name;
    }
    const nextUrl = data.next;
    if (!nextUrl) {
      return null;
    }
    return getVersion(version, withAlpine, architecture, nextUrl);
  } catch (error) {
    console.error('Failed to fetch the Docker tags', error);
  }
}

async function getPackageVersion(filePath = resolve(ROOT, "package.json")) {
  const content = JSON.parse(await readFile(filePath, 'utf-8'));
  const version = content.engines?.node;
  if (!version) {
    throw new Error(`Cannot find node version`);
  }
  return version;
}

const nodeVersion = await getPackageVersion();
const version = await getVersion(nodeVersion);
if (!version) {
  process.stderr.write(`Failed getting docker image for ${nodeVersion}`);
  process.exit(1);
}
process.stdout.write(version);