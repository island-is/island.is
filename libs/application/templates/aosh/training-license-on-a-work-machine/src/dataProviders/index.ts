import { defineTemplateApi } from '@island.is/application/types'

export { IdentityApi, UserProfileApi } from '@island.is/application/types'

export const LicensesApi = defineTemplateApi({
  action: 'getLicenses',
  externalDataId: 'licenses',
})
