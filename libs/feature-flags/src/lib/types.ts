import { createClient } from 'configcat-js'
import { ServerSideFeature } from './features'

export interface FeatureFlagUser {
  id: string
  attributes?: { [key: string]: string }
}

export type GetAllValues = ReturnType<
  ReturnType<typeof createClient>['getAllValuesAsync']
>

type PromiseReturnType<T> = T extends Promise<infer Return> ? Return : T

export type SettingKeyValue = PromiseReturnType<GetAllValues>[0]

export interface FeatureFlagClient {
  getValue(
    key: string,
    defaultValue: boolean | string,
    user?: FeatureFlagUser,
  ): Promise<boolean | string>

  getAllValues(user?: FeatureFlagUser): GetAllValues
  dispose(): void
}

export interface FeatureFlagClientProps {
  sdkKey?: string
}

/// This is an interface to query the status of feature flags specific to the server side
export interface ServerSideFeatureClientType {
  isOn(feature: ServerSideFeature): boolean
}
