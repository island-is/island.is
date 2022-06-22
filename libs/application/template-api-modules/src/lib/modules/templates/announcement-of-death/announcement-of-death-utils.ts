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
  initial: true,
  description: '',
  assetNumber: '',
  share: 0,
}

export const dummyMember: EstateMember = {
  name: '',
  nationalId: '',
  relation: '',
  initial: false,
  dummy: true,
}
