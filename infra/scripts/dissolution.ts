import { Apps } from 'aws-sdk/clients/opsworks'
import * as fs from 'fs'
interface File {
  file: string
  hash: string
  deps?: string[]
}
interface NxData {
  graph: {
    nodes: {
      [key: string]: {
        name: string
        type: string
        data: {
          files: File[]
        }
      }
    }
  }
}

interface DependencyInfo {
  name: string
  dependencies: {
    apps: string[]
    level: number
  } 
}

function uniqueFilter(value: string, index: number, self: string[]) {
  return self.indexOf(value) === index
}
function sortLevels(deps: DependencyInfo[]) {
    deps.forEach((app) => {
    })
}

function getComponentsAndDependencies(data: NxData) {
  let depsInfo: DependencyInfo[] = []
  const uniqueDeps = new Set();
  Object.values(data.graph.nodes).forEach((node) => {
    node.data.files.forEach((file) => {
      if (file.deps) {
        depsInfo.push({
          name: node.name,
          dependencies: { 
            apps: file.deps
            .filter((str) => !str.startsWith('npm'))
            .filter(uniqueFilter),
            level: file.deps
            .filter((str) => !str.startsWith('npm'))
            .filter(uniqueFilter).length
          }
        })
        file.deps
          .filter((str) => !str.startsWith('npm'))
          .filter(uniqueFilter)
          .forEach((dep) => {
            if (!reverseDeps.has(dep)) {
              reverseDeps.set(dep, [])
            }
            const dependents = reverseDeps.get(dep)
            if (dependents) {
              dependents.push(node.name)
            }
          })
      }
    })
  })
  return depsInfo
}

const reverseDeps: Map<string, string[]> = new Map()
const jsonData = fs.readFileSync('nx-graph.json', 'utf8')
const deps = getComponentsAndDependencies(JSON.parse(jsonData))
//processReverseDeps()
function processReverseDeps() {
    deps.sort((a, b) => b.dependencies.level - a.dependencies.level);
    const queue: string[] = []
    const processed = new Set()

    deps.forEach(({ name, dependencies }) => {
        if (dependencies.level === 0) {
            queue.push(name)
        }
    })
    while (queue.length) {
        const component = queue.shift()
        if (component) {
            console.log(component)
            processed.add(component)
            deps.forEach(({ name, dependencies }) => {
                if (dependencies.apps.includes(component) && !processed.has(name)) {
                    queue.push(name)
                }
            })
        }
    }
}

function processDependencies(depsInfo: DependencyInfo[]) {
    const queue: string[] = []
    const processed = new Set()
    depsInfo.forEach((dep) => {
        if (dep.dependencies.level === 0) {
            queue.push(dep.name)
        }
    })
    while (queue.length) {
        const component = queue.shift()
        if (component) {
            processed.add(component)
            depsInfo.forEach((dep) => {
                if (dep.dependencies.apps.includes(component) && !processed.has(dep.name)) {
                    queue.push(...dep.dependencies.apps.filter(uniqueFilter))
                }
            })
        }
    }
    return Array.from(processed);
}

const orderedDeps = processDependencies(deps)
//console.log(deps)
console.log(orderedDeps)
