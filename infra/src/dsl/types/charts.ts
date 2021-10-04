import { FeatureNames } from '../features'
import { OpsEnv, Service } from './input-types'

export interface UberChartType {
  env: EnvironmentConfig

  ref(from: Service, to: Service): string
}

export interface EnvironmentConfig {
  auroraHost: string
  domain: string
  releaseName: string
  defaultMaxReplicas: number
  rolloutStrategy?: 'RollingUpdate' | 'Recreate'
  type: OpsEnv
  featuresOn: FeatureNames[]
  awsAccountRegion: 'eu-west-1' | 'us-east-1'
  awsAccountId: string
  feature?: string
  global: any
}

export type EnvironmentServices = { [name in OpsEnv]: Service[] }

export type EnvironmentConfigs = { [name in OpsEnv]: EnvironmentConfig }
