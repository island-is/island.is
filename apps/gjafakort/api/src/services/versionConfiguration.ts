import { environment } from '../environments'

const versionCutoffTime = '2021-06-01T00:00:00'

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

export const getVersionConfiguration = (): Version => {
  const useV2 = new Date() >= new Date(versionCutoffTime) || environment.isFerdagjof2Enabled

  return useV2 ? v2 : v1
}
