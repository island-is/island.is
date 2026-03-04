import { defineTemplateApi } from '@island.is/application/types'

export {
  NationalRegistryV3UserApi,
  UserProfileApi,
} from '@island.is/application/types'

export const checkResidence = defineTemplateApi({
  action: 'checkResidence',
  order: 0,
  throwOnError: true,
})

export const grindaVikHousing = defineTemplateApi({
  action: 'getGrindavikHousing',
  order: 1,
})
