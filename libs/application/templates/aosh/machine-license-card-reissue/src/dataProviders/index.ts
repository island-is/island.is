import { defineTemplateApi } from '@island.is/application/types'
import { ApiActions } from '../shared'
export { IdentityApi, UserProfileApi } from '@island.is/application/types'

export const LicensesApi = defineTemplateApi({
  action: ApiActions.getLicenses,
  externalDataId: 'licenses',
})
