import { Client } from './configcat'
import { FeatureFlagClient, FeatureFlagClientProps } from './types'

export async function createClient(
  config?: FeatureFlagClientProps,
): Promise<FeatureFlagClient> {
  return await Client.create(config ?? {})
}
