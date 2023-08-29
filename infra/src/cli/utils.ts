import { execSync } from 'child_process'
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { EnvDifferences, EnvObject, EnvMappingType } from './types'
import { renderSecretsCommand } from './render-secrets'

const DEFAULT_FILE = '.env.secret'
const projectRoot = execSync('git rev-parse --show-toplevel').toString().trim()

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

export const escapeValue = (value: string): string => {
  return value.replace(/\s+/g, ' ').replace(/'/g, "'\\''")
}

const parseEnvFile = (filePath: string): EnvObject => {
  try {
    const absPath = resolve(projectRoot, filePath)
    const content = readFileSync(absPath, 'utf-8')
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

const compareEnvs = (
  fileEnvs: Record<string, string>,
  ssmEnvs: Record<string, string>,
) => {
  const added: Record<string, string> = {}
  const changed: Record<string, string> = {}

  for (const [key, value] of Object.entries(ssmEnvs)) {
    if (!fileEnvs[key]) {
      added[key] = value
    } else if (escapeValue(fileEnvs[key]) !== ssmEnvs[key]) {
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

export const updateSecretFiles = async (services: string[]): Promise<void> => {
  for (const service of services) {
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
      for (const [env, dict] of Object.entries({
        [filePath]: fileEnvs,
        added,
        changed,
      })) {
        for (const [key, value] of Object.entries(dict)) {
          if (value == "'") {
            console.error(
              `Secret ${key} in environment ${env} is literally an apostrophe (')`,
            )
          }
        }
      }

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

      writeFileSync(absPath, updatedFileContent.trim() + '\n')
    }
  }
}

const generateUpdatedFileContent = (
  sortedEnvs: [string, string][],
  differences: EnvDifferences,
  mapping: EnvMappingType,
  fileEnvs: Record<string, string>,
): string => {
  return sortedEnvs.reduce((content, [envName, value]) => {
    const line = mapping.isBashEnv
      ? `export ${envName}='${value}'`
      : `${envName}='${value}'`

    if (
      Object.keys(differences.added).some(
        ([addedName]) => addedName === envName,
      )
    ) {
      appendToEnvLog(`Added ${line}`)
    } else if (
      Object.keys(differences.changed).some(
        ([changedName]) => changedName === envName,
      )
    ) {
      appendToEnvLog(
        `Updated ${envName} from '${fileEnvs[envName]}' to '${value}'`,
      )
    }

    return `${content}\n${line}`
  }, '')
}

const appendToEnvLog = (message: string): void => {
  const logFilePath = resolve(projectRoot, '.env.log')
  appendFileSync(logFilePath, `${message}\n`)
}
