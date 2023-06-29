import {
  InstitutionNationalIds,
  PaymentCatalogApi,
  defineTemplateApi,
} from '@island.is/application/types'
import { ApiActions } from '../shared'

export {
  NationalRegistryUserApi,
  NationalRegistrySpouseApi,
  NationalRegistryMaritalTitleApi,
  ChildrenCustodyInformationApi,
  UserProfileApi,
} from '@island.is/application/types'

export const UtlendingastofnunPaymentCatalogApi = PaymentCatalogApi.configure({
  params: {
    organizationId: InstitutionNationalIds.UTLENDINGASTOFNUN,
  },
  externalDataId: 'payment',
})

export const CountriesApi = defineTemplateApi({
  action: ApiActions.getCountries,
  externalDataId: 'countries',
})

export const TravelDocumentTypesApi = defineTemplateApi({
  action: ApiActions.getTravelDocumentTypes,
  externalDataId: 'travelDocumentTypes',
})

export const CurrentResidencePermitApi = defineTemplateApi({
  action: ApiActions.getCurrentResidencePermit,
  externalDataId: 'currentResidencePermit',
})

export const OldStayAbroadListApi = defineTemplateApi({
  action: ApiActions.getOldStayAbroadList,
  externalDataId: 'oldStayAbroadList',
})

export const OldCriminalRecordListApi = defineTemplateApi({
  action: ApiActions.getOldCriminalRecordList,
  externalDataId: 'oldCriminalRecordList',
})

export const OldStudyItemApi = defineTemplateApi({
  action: ApiActions.getOldStudyItem,
  externalDataId: 'oldStudyItem',
})

export const OldPassportItemApi = defineTemplateApi({
  action: ApiActions.getOldPassportItem,
  externalDataId: 'oldPassportItem',
})

export const OldAgentItemApi = defineTemplateApi({
  action: ApiActions.getOldAgentItem,
  externalDataId: 'oldAgentItem',
})
