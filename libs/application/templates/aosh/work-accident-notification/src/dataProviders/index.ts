import { defineTemplateApi } from '@island.is/application/types'
import { ApiActions } from '../shared/constants'

export { IdentityApi, UserProfileApi } from '@island.is/application/types'

export const getAoshInputOptionsApi = defineTemplateApi({
  action: ApiActions.getInputOptions,
  externalDataId: 'aoshData',
})
