import { ServerSideFeature } from './features'

export interface FeatureFlagUser {
  id: string
  attributes?: { [key: string]: string }
}

export interface FeatureFlagClient {
  getValue(
    key: string,
    defaultValue: boolean | string,
    user?: FeatureFlagUser,
  ): Promise<boolean | string>

  dispose(): void
}

export interface FeatureFlagClientProps {
  sdkKey?: string
}

/// This is an interface to query the status of feature flags specific to the server side
export interface ServerSideFeatureClientType {
  isOn(feature: ServerSideFeature): boolean
}
