import type { SettingValue, SettingTypeOf } from 'configcat-common'
import { ServerSideFeature } from './features'

export interface FeatureFlagUser {
  id: string
  attributes?: { [key: string]: string }
}

export interface FeatureFlagClient {
  getValue<T extends SettingValue>(
    key: string,
    defaultValue: T,
    user?: FeatureFlagUser,
  ): Promise<SettingTypeOf<T>>

  dispose(): void
}

export interface FeatureFlagClientProps {
  sdkKey?: string
}

/// This is an interface to query the status of feature flags specific to the server side
export interface ServerSideFeatureClientType {
  isOn(feature: ServerSideFeature): boolean
}

export type { SettingTypeOf, SettingValue }

type NodeModuleType = typeof import('configcat-node')
type JsModuleType = typeof import('configcat-js')
export type ConfigCatModule = NodeModuleType | JsModuleType
