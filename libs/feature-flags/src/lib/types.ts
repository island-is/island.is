export interface User {
  id: string
  attributes?: { [key: string]: string }
}

export interface FeatureFlagClient {
  getValue(
    key: string,
    defaultValue: boolean | string,
    user?: User,
  ): Promise<boolean | string>
}

export interface FeatureFlagClientProps {
  sdkKey?: string
}
