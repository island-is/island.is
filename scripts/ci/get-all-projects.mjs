// @ts-check
import { execSync, exec } from 'child_process'
import { readFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'

// Get all projects by running yarn nx show projects

const __dirname = dirname(new URL(import.meta.url).pathname)
const ROOT = resolve(__dirname, '..', '..')
execSync('yarn nx graph --file graph.json', { encoding: 'utf-8' })
const graph = JSON.parse(await readFile('graph.json', { encoding: 'utf-8' }))
execSync('rm graph.json')

const output = execSync('yarn nx show projects --json', { encoding: 'utf-8' })
const projects = await Promise.all(
  JSON.parse(output).map(async (e) => {
    const data = {
      root: graph.graph.nodes[e].data.root,
      name: graph.graph.nodes[e].name,
    }
    return data
  }),
)

console.log(JSON.stringify(projects))
