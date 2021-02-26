import { Client } from './configcat'
import { FeatureFlagClient, FeatureFlagClientProps } from './types'

export function createClient(
  config?: FeatureFlagClientProps,
): FeatureFlagClient {
  return new Client(config ?? {})
}
