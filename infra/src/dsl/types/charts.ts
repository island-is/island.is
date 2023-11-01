import { FeatureNames } from '../features'
import {
  OpsEnv,
  OpsEnvWithLocal,
  ServiceDefinition,
  ServiceDefinitionCore,
} from './input-types'
import { ServiceBuilder } from '../dsl'

export interface ReferenceResolver {
  ref(from: ServiceDefinitionCore, to: ServiceDefinition | string): string
}

export interface EnvironmentConfig {
  auroraHost: string
  auroraReplica?: string
  domain: string
  defaultMaxReplicas: number
  defaultMinReplicas: number
  type: OpsEnvWithLocal
  featuresOn: FeatureNames[]
  awsAccountRegion: 'eu-west-1' | 'us-east-1'
  awsAccountId: string
  feature?: string
  redisHost: string
  global: any
}

export type OpsEnvName =
  | 'dev01'
  | 'devIds'
  | 'staging01'
  | 'stagingIds'
  | 'prod'
  | 'prod-ids'

export type EnvironmentServices = { [name in OpsEnv]: ServiceBuilder<any>[] }

export type EnvironmentConfigs = { [name in OpsEnvName]: EnvironmentConfig }
