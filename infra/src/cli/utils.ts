import { execSync } from 'child_process'
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { EnvironmentServices } from '../dsl/types/charts'
import { ChartName, Charts } from '../uber-charts/all-charts'
import { renderSecretsCommand } from './render-secrets'
import { EnvDifferences, EnvMappingType, EnvObject, OpsEnv } from './types'

const DEFAULT_FILE = '.env.secret'
const projectRoot = execSync('git rev-parse --show-toplevel').toString().trim()
const envLogFilePath = resolve(projectRoot, '.env.log')

const envToFileMapping: Record<string, EnvMappingType> = {
  [DEFAULT_FILE]: {
    ssmParameters: [],
    isBashEnv: true,
  },
  'nx-cloud.env': {
    ssmParameters: ['NX_CLOUD_ACCESS_TOKEN'],
    isBashEnv: false,
  },
}

export function escapeValue(value: string, key?: string): string {
  value = value.replace(/\s+/g, ' ')
  if (value.match(/'/)) {
    console.error(`Secret values cannot contain single quotes, discarding:`, {
      key,
      value,
    })
    return value.replace(/'/g, '')
  }
  return value
}

function parseEnvFile(filePath: string): EnvObject {
  try {
    const absPath = resolve(projectRoot, filePath)
    if (!existsSync(absPath)) {
      console.log(`File ${absPath} does not exist.`)
      return {}
    }
    const content = readFileSync(absPath, 'utf-8')
    // TODO: Remove if unused
    const isBash = envToFileMapping[filePath]?.isBashEnv

    // Do we want to require 'export' in bash-envs (custom local-files)?
    const pattern =
      /^(?:export )?(?<key>\w+)=(?<quotation>['"]?)(?<value>.*)\k<quotation>$/
    const envObj: EnvObject = {}

    content.split('\n').forEach((line) => {
      const trimmedLine = line.trim()
      if (!trimmedLine) return // Skip empty lines
      const noExport = trimmedLine.split('export ').pop() // Can only be undefined if line is empty
      if (!noExport) return // Skip empty lines, again? Mr. TypeScript?!

      const match = trimmedLine.match(pattern)
      if (match && match.groups?.key && match.groups?.value != undefined) {
        const key = match.groups.key
        const value = match.groups.value
        envObj[key] = value
      } else {
        console.log(`Failed to parse line: ${trimmedLine}`)
      }
    })
    return envObj
  } catch (error) {
    console.error(`Failed to parse ${filePath}:`, error)
    return {}
  }
}

function compareEnvs(
  fileEnvs: Record<string, string>,
  ssmEnvs: Record<string, string>,
) {
  const added: Record<string, string> = {}
  const changed: Record<string, string> = {}

  for (const [key, value] of Object.entries(ssmEnvs)) {
    if (!fileEnvs[key]) {
      added[key] = value
    } else if (escapeValue(fileEnvs[key], key) !== ssmEnvs[key]) {
      changed[key] = ssmEnvs[key]
    }
  }

  return { added, changed }
}

export const resetAllMappedFiles = async (): Promise<void> => {
  for (const filePath of Object.keys(envToFileMapping)) {
    const resolvedPath = resolve(projectRoot, filePath)
    if (existsSync(resolvedPath)) {
      console.log(`Resetting your ${resolvedPath} file`)
      writeFileSync(resolvedPath, '')
    } else {
      console.log(`File ${resolvedPath} does not exist.`)
    }
  }
}

export function serviceExists(
  service: string,
  chart?: ChartName,
  env?: OpsEnv,
): boolean {
  const charts = chart ? [chart] : (Object.keys(Charts) as ChartName[])
  for (const chart of charts) {
    const envServices: EnvironmentServices = Charts[chart]
    const opsEnvs = env ? [env] : (Object.keys(envServices) as OpsEnv[])
    for (const opsEnv of opsEnvs) {
      const services = envServices[opsEnv]

      for (const s of services) {
        if (s.name() === service) return true
      }
    }
  }

  return false
}

export const updateSecretFiles = async (services: string[]) => {
  const changes = { changed: 0, added: 0 }
  const failedServices = []
  for (const service of services) {
    // Check if service is present in Charts
    if (!serviceExists(service)) {
      console.error(`Service '${service}' does not exist.`)
      failedServices.push(service)
      continue
    }

    const secrets = await renderSecretsCommand(service)
    const ssmEnvs = Object.fromEntries(secrets)

    for (const filePath in envToFileMapping) {
      const absPath = resolve(projectRoot, filePath)
      const mapping = envToFileMapping[filePath]
      const envsForFile: Record<string, string> = {}
      const explicitlyMappedEnvNames = Object.values(envToFileMapping).flatMap(
        (mapping) => mapping.ssmParameters,
      )

      for (const [envName] of secrets) {
        if (mapping.ssmParameters.includes(envName)) {
          envsForFile[envName] = ssmEnvs[envName]
        } else if (
          mapping.ssmParameters.length === 0 &&
          !explicitlyMappedEnvNames.includes(envName)
        ) {
          envsForFile[envName] = ssmEnvs[envName]
        }
      }

      if (!Object.keys(envsForFile).length) continue
      const fileEnvs = parseEnvFile(filePath)
      const differences = compareEnvs(fileEnvs, envsForFile)
      const { added, changed } = differences

      // Merging existing, added, and updated envs
      const mergedEnvs = {
        ...fileEnvs,
        ...added,
        ...changed,
      }

      // Sorting combined envs alphabetically
      const sortedKeys = Object.keys(mergedEnvs).sort((a, b) =>
        a.localeCompare(b),
      )
      const sortedEnvs: [string, string][] = sortedKeys.map((key: string) => [
        key,
        mergedEnvs[key],
      ])

      const updatedFileContent = generateUpdatedFileContent(
        sortedEnvs,
        differences,
        mapping,
        fileEnvs,
      )

      const n_changed = Object.keys(changed).length
      const n_added = Object.keys(added).length
      changes.changed += n_changed
      changes.added += n_added

      writeFileSync(absPath, updatedFileContent.trim() + '\n')
    }
  }
  return { changes, failedServices }
}

function generateUpdatedFileContent(
  sortedEnvs: [string, string][],
  differences: EnvDifferences,
  mapping: EnvMappingType,
  fileEnvs: Record<string, string>,
): string {
  return sortedEnvs.reduce((content, [envName, value]) => {
    const escapedValue = escapeValue(value)
    const line = mapping.isBashEnv
      ? `export ${envName}='${escapedValue}'`
      : `${envName}='${escapedValue}'`

    if (
      Object.keys(differences.added).some((addedName) => addedName === envName)
    ) {
      appendToEnvLog(`Added ${line}`)
    } else if (
      Object.keys(differences.changed).some(
        (changedName) => changedName === envName,
      )
    ) {
      appendToEnvLog(
        `Updated ${envName} from '${fileEnvs[envName]}' to '${escapedValue}'`,
      )
    }

    return `${content}\n${line}`
  }, '')
}

function appendToEnvLog(message: string): void {
  appendFileSync(envLogFilePath, `${message}\n`)
}
