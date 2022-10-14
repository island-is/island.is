import { ServerSideFeature } from './features'

export interface FeatureFlagUser {
  id: string
  attributes?: { [key: string]: string }
}

export interface FeatureFlagClient {
  getValue<T extends boolean | string>(
    key: string,
    defaultValue: T,
    user?: FeatureFlagUser,
  ): Promise<T>

  dispose(): void
}

export interface FeatureFlagClientProps {
  sdkKey?: string
}

/// This is an interface to query the status of feature flags specific to the server side
export interface ServerSideFeatureClientType {
  isOn(feature: ServerSideFeature): boolean
}
