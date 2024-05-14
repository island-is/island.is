import {
  Asset,
  EstateMember,
} from '@island.is/application/templates/announcement-of-death/types'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { join } from 'path'

export function baseMapper<T>(entity: T): T {
  return {
    ...entity,
    initial: true,
  }
}

export const pathToAsset = (file: string) => {
  if (isRunningOnEnvironment('local')) {
    return join(
      __dirname,
      `../../../../libs/application/template-api-modules/src/lib/modules/templates/announcement-of-death/emailGenerators/assets/${file}`,
    )
  }

  return join(
    __dirname,
    `./announcement-of-death/emailGenerators/assets/${file}`,
  )
}

export const dummyAsset: Asset = {
  dummy: true,
  initial: false,
  description: '',
  assetNumber: 'F1234567',
}

export const dummyMember: EstateMember = {
  name: 'Stúfur Mack',
  nationalId: '2222222229',
  relation: 'Sonur',
  initial: false,
  dummy: true,
}
