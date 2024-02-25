import { defineTemplateApi } from '@island.is/application/types'

export {
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'

export const checkResidence = defineTemplateApi({
  action: 'checkResidence',
})

export const grindaVikHousing = defineTemplateApi({
  action: 'getGrindavikHousing',
})
