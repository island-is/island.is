import type { IConfigCatClient } from 'configcat-js'

// Mutable reference to the ConfigCat client, set by FeatureFlagProvider on mount.
export let featureFlagClient: IConfigCatClient | null = null

export function setFeatureFlagClient(client: IConfigCatClient | null) {
  featureFlagClient = client
}
