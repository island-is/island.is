import {
  Asset,
  EstateMember,
} from '@island.is/application/templates/announcement-of-death/types'

export function baseMapper<T>(entity: T): T {
  return {
    ...entity,
    initial: true,
  }
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
