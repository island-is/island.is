import { createClient, IJSAutoPollOptions, DataGovernance } from 'configcat-js'
import { environment } from '../environments'

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

const IS_FERDAGJOF_2_ENABLED = 'isferdagjof2enabled'

const sdkKey = environment.configCat.sdkKey
if (!sdkKey) {
  throw new Error(
    'Trying to initialize configcat client without configCat.sdkKey environment variable',
  )
}

const configCat = eval('require')('configcat-node').createClient(sdkKey, {
  dataGovernance: DataGovernance.EuOnly,
})

export const getVersionConfiguration = async (): Promise<Version> => {
  const isFerdagjof2Enabled = await configCat.getValueAsync(
    IS_FERDAGJOF_2_ENABLED,
    false,
  )

  return isFerdagjof2Enabled ? v2 : v1
}
