import { Client } from './configcat'
import { FeatureFlagClient, FeatureFlagClientProps } from './types'

export const sdkKeys = {
  development: 'YcfYCOwBTUeI04mWOWpPdA/KgCHhUk0_k2BdiKMaNh3qA',
  staging: 'YcfYCOwBTUeI04mWOWpPdA/X_wECeZ5PEWKZ2WRFcRQqw',
  production: 'YcfYCOwBTUeI04mWOWpPdA/o55-m6AMI0CrSZ5Os_UdvQ',
}

export function createClient(
  config?: FeatureFlagClientProps,
): FeatureFlagClient {
  return new Client(config ?? {})
}
