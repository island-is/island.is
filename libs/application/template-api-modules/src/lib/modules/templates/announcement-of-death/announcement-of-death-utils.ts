import {
  Asset,
  EstateMember,
} from '@island.is/application/templates/announcement-of-death/types'
import { join } from 'path'

export function baseMapper<T>(entity: T): T {
  return {
    ...entity,
    initial: true,
  }
}

export const pathToAsset = (file: string) => {
  const a = join(
    __dirname,
    `./announcement-of-death/emailGenerators/assets/${file}`,
  )
  console.log('FOOBAR:', a)
  return a
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
