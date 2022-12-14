
import { defineTemplateApi } from '@island.is/application/types'
export {
  NationalRegistryUserApi,
  UserProfileApi,
  PaymentCatalogApi,
  MockProviderApi,
  DistrictsApi,

} from '@island.is/application/types'

export const IdentityDocumentApi = defineTemplateApi({
  action: 'identityDocument'
})