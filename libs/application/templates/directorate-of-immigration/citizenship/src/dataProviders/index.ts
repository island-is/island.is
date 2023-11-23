import {
  InstitutionNationalIds,
  PaymentCatalogApi,
  defineTemplateApi,
} from '@island.is/application/types'
import { ApiActions } from '../shared'
import { error } from '../lib/messages'

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

export const CurrentCountryOfResidenceListApi = defineTemplateApi({
  action: ApiActions.getCurrentCountryOfResidenceList,
  externalDataId: 'currentCountryOfResidenceList',
})

export const ResidenceInIcelandLastChangeDateApi = defineTemplateApi({
  action: ApiActions.getResidenceInIcelandLastChangeDate,
  externalDataId: 'residenceInIcelandLastChangeDate',
})

export const CountriesApi = defineTemplateApi({
  action: 'getCountries',
  externalDataId: 'countries',
  namespace: 'DirectorateOfImmigrationShared',
})

export const TravelDocumentTypesApi = defineTemplateApi({
  action: 'getTravelDocumentTypes',
  externalDataId: 'travelDocumentTypes',
  namespace: 'DirectorateOfImmigrationShared',
})

export const CurrentStayAbroadListApi = defineTemplateApi({
  action: 'getCurrentStayAbroadList',
  externalDataId: 'currentStayAbroadList',
  namespace: 'DirectorateOfImmigrationShared',
})

export const CurrentPassportItemApi = defineTemplateApi({
  action: 'getCurrentPassportItem',
  externalDataId: 'currentPassportItem',
  namespace: 'DirectorateOfImmigrationShared',
})

export const NationalRegistryIndividualApi = defineTemplateApi({
  action: 'nationalRegistry',
  externalDataId: 'individual',
  namespace: 'NationalRegistry',
  params: {
    validateAlreadyHasIcelandicCitizenship: true,
    ageToValidate: 18,
    ageToValidateError: {
      title: error.notOldEnough,
      summary: error.notOldEnough,
    },
  },
})

export const NationalRegistryBirthplaceApi = defineTemplateApi({
  action: 'getBirthplace',
  externalDataId: 'birthplace',
  namespace: 'NationalRegistry',
})

export const NationalRegistrySpouseDetailsApi = defineTemplateApi({
  action: 'getSpouse',
  externalDataId: 'spouseDetails',
  namespace: 'NationalRegistry',
})

export const NationalRegistryParentsApi = defineTemplateApi({
  action: 'getParents',
  externalDataId: 'nationalRegistryParents',
  namespace: 'NationalRegistry',
})
