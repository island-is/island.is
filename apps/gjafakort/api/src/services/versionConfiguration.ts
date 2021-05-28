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

export const getVersionConfiguration = (): Version => {
  return environment.isFerdagjof2Enabled ? v2 : v1
}
