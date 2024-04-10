import { exec } from 'child_process'
import {
  EnvironmentVariablesForEnv,
  ServiceDefinitionForEnv,
  ValueSource,
} from '../types/input-types'
import { ReferenceResolver, EnvironmentConfig } from '../types/charts'
import { ContainerEnvironmentVariables } from '../types/output-types'

const runCommand = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error || stderr || !stdout) {
        reject(new Error(`Error running "${command}": ${error || stderr}`))
        return
      }
      resolve(stdout.trim())
    })
  })
}

export const getRepoUrl = async (): Promise<string> => {
  const out = await runCommand('git remote get-url origin')
  const parsed = out.replace('git@', '').replace(':', '/').replace('.git', '')
  return parsed
}

export const getCommitSha = async (): Promise<string> => {
  const out = await runCommand('git rev-parse HEAD')
  return out
}

export const resolveWithMaxLength = (str: string, max: number) => {
  if (str.length > max) {
    return `${str.substr(0, Math.ceil(max / 3))}${str.substr((-max / 3) * 2)}`
  }
  return str
}

export function serializeValueSource(
  value: ValueSource,
  deployment: ReferenceResolver,
  service: ServiceDefinitionForEnv,
  env: EnvironmentConfig,
): { type: 'success'; value: string } {
  const result =
    typeof value === 'string'
      ? value
      : value({
          env: env,
          featureDeploymentName: env.feature,
          svc: (dep) =>
            deployment.ref(
              service,
              typeof dep === 'string' ? dep : dep.serviceDef,
            ),
        })
  return { type: 'success', value: result }
}

export function serializeEnvironmentVariables(
  service: ServiceDefinitionForEnv,
  deployment: ReferenceResolver,
  envs: EnvironmentVariablesForEnv,
  env: EnvironmentConfig,
): { envs: ContainerEnvironmentVariables } {
  return Object.entries(envs).reduce(
    (acc, [name, value]) => {
      const r = serializeValueSource(value, deployment, service, env)
      switch (r.type) {
        case 'success':
          return {
            envs: {
              ...acc.envs,
              [name]: r.value,
            },
          }
      }
    },
    { envs: {} as ContainerEnvironmentVariables },
  )
}

export const postgresIdentifier = (id: string) => id.replace(/[\W\s]/gi, '_')
