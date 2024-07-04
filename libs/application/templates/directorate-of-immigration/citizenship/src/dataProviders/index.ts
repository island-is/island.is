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

export const ApplicantInformationApi = defineTemplateApi({
  action: ApiActions.applicantInformation,
  externalDataId: 'applicantInformation',
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

export const NationalRegistryIndividualApi = defineTemplateApi({
  action: 'nationalRegistry',
  externalDataId: 'individual',
  namespace: 'NationalRegistry',
  params: {
    validateAlreadyHasIcelandicCitizenship: true,
    legalDomicileIceland: true,
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
