import {
  InstitutionNationalIds,
  PaymentCatalogApi,
  defineTemplateApi,
} from '@island.is/application/types'
import { ApiActions } from '../shared'

export {
  UserProfileApi,
  ChildrenCustodyInformationApi,
} from '@island.is/application/types'

export const UtlendingastofnunPaymentCatalogApi = PaymentCatalogApi.configure({
  params: {
    organizationId: InstitutionNationalIds.UTLENDINGASTOFNUN,
  },
  externalDataId: 'payment',
})

export const ResidenceConditionInfoApi = defineTemplateApi({
  action: ApiActions.getResidenceConditionInfo,
  externalDataId: 'residenceConditionInfo',
})

export const CountriesApi = defineTemplateApi({
  action: ApiActions.getCountries,
  externalDataId: 'countries',
})

export const TravelDocumentTypesApi = defineTemplateApi({
  action: ApiActions.getTravelDocumentTypes,
  externalDataId: 'travelDocumentTypes',
})

export const OldCountryOfResidenceListApi = defineTemplateApi({
  action: ApiActions.getOldCountryOfResidenceList,
  externalDataId: 'oldCountryOfResidenceList',
})

export const OldStayAbroadListApi = defineTemplateApi({
  action: ApiActions.getOldStayAbroadList,
  externalDataId: 'oldStayAbroadList',
})

export const OldPassportItemApi = defineTemplateApi({
  action: ApiActions.getOldPassportItem,
  externalDataId: 'oldPassportItem',
})

export const NationalRegistryIndividualApi = defineTemplateApi({
  action: ApiActions.getNationalRegistryIndividual,
  externalDataId: 'individual',
})

export const NationalRegistrySpouseDetailsApi = defineTemplateApi({
  action: ApiActions.getNationalRegistrySpouseDetails,
  externalDataId: 'spouseDetails',
})

export const BirthplaceApi = defineTemplateApi({
  action: ApiActions.getBirthplace,
  externalDataId: 'birthplace',
})

export const NationalRegistryParentsApi = defineTemplateApi({
  action: 'getParents',
  externalDataId: 'nationalRegistryParents',
  namespace: 'NationalRegistry',
})
