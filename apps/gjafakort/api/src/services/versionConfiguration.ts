import { createClient } from '@island.is/feature-flags'
import { environment } from '../environments'

const featureFlagClient = createClient({
  sdkKey: environment.configCat.sdkKey,
})

interface Version {
  yearBornLimit: number
  type: 'gjafakort-user' | 'gjafakort-user-2'
}

const v1: Version = {
  yearBornLimit: 2002,
  type: 'gjafakort-user',
}

const v2: Version = {
  yearBornLimit: 2003,
  type: 'gjafakort-user-2',
}

const CONFIGCAT_FEATURE_FLAG_KEY = 'IS_FERDAGJOF_2_ENABLED'

export const getVersionConfiguration = async (): Promise<Version> => {
  const isFerdagjof2Enabled = await featureFlagClient.getValue(CONFIGCAT_FEATURE_FLAG_KEY, false)

  return isFerdagjof2Enabled ? v2 : v1
}
