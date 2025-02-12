import type {
  SettingValue,
  SettingTypeOf,
  IAutoPollOptions,
  IConfigCatClient,
  PollingMode,
} from 'configcat-common'
import { ServerSideFeature } from './features'

export interface FeatureFlagUser {
  id: string
  attributes: { [key: string]: string }
}

export interface FeatureFlagClient {
  dispose: () => void
  getValue: <T extends SettingValue>(
    key: string,
    defaultValue: T,
    user?: FeatureFlagUser,
  ) => Promise<SettingTypeOf<T>>
}

export interface FeatureFlagClientProps {
  sdkKey?: string
}

/// This is an interface to query the status of feature flags specific to the server side
export interface ServerSideFeatureClientType {
  isOn(feature: ServerSideFeature): boolean
}

export type { SettingTypeOf, SettingValue }

export interface ConfigCatModule {
  getClient: (
    sdkKey: string,
    pollingMode: PollingMode,
    config: IAutoPollOptions,
  ) => IConfigCatClient
}
