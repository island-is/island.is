import {
  InstitutionNationalIds,
  PaymentCatalogApi,
  defineTemplateApi,
} from '@island.is/application/types'
import { ApiActions } from '../shared'

export {
  // NationalRegistryUserApi,
  IdentityApi,
  UserProfileApi,
  ChildrenCustodyInformationApi,
} from '@island.is/application/types'

export const UtlendingastofnunPaymentCatalogApi = PaymentCatalogApi.configure({
  params: {
    organizationId: InstitutionNationalIds.UTLENDINGASTOFNUN,
  },
  externalDataId: 'payment',
})

export const NationalRegistryBirthplaceApi = defineTemplateApi({
  action: 'getBirthplace',
  externalDataId: 'nationalRegistryBirthplace',
  namespace: 'NationalRegistry',
})

export const NationalRegistryParentsApi = defineTemplateApi({
  action: 'getParents',
  externalDataId: 'nationalRegistryParents',
  namespace: 'NationalRegistry',
})

export const CitizenshipIndividualApi = defineTemplateApi({
  action: ApiActions.getCitizenshipIndividual,
  externalDataId: 'individual',
})

export const CitizenGetSpouseApi = defineTemplateApi({
  action: 'getSpouseWithDetails',
  externalDataId: 'spouseDetails',
})
