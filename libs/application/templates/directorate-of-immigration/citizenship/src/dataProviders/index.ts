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

export const ResidenceConditionsApi = defineTemplateApi({
  action: ApiActions.getResidenceConditions,
  externalDataId: 'residenceConditions',
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

export const OldForeignCriminalRecordFileListApi = defineTemplateApi({
  action: ApiActions.getOldForeignCriminalRecordFileList,
  externalDataId: 'oldForeignCriminalRecordFileList',
})

export const NationalRegistryIndividualApi = defineTemplateApi({
  action: ApiActions.getNationalRegistryIndividual,
  externalDataId: 'individual',
})

export const NationalRegistrySpouseDetailsApi = defineTemplateApi({
  action: ApiActions.getNationalRegistrySpouseDetails,
  externalDataId: 'spouseDetails',
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
