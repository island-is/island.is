import { FeatureNames as ServerSideFeatureNames } from '../../../../infra/src/dsl/features'

export { ServerSideFeatureNames }

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
}

export interface FeatureFlagClientProps {
  sdkKey?: string
}

/// This is an interface to query the status of feature flags specific to the server side
export interface ServerSideFeature {
  isOn(feature: ServerSideFeatureNames): boolean
}
