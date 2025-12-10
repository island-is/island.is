import {
  InstitutionNationalIds,
  PaymentCatalogApi,
  defineTemplateApi,
} from '@island.is/application/types'
import { ApiActions } from '../shared'

export { UserProfileApi } from '@island.is/application/types'

export const EmbaettiLandlaeknisPaymentCatalogApi = PaymentCatalogApi.configure(
  {
    params: {
      organizationId: InstitutionNationalIds.EMBAETTI_LANDLAEKNIS,
    },
    externalDataId: 'payment',
  },
)

export const HealtcareLicenesApi = defineTemplateApi({
  action: ApiActions.getMyHealthcareLicenses,
  externalDataId: 'healthcareLicenses',
})

export const ProcessPermitsApi = defineTemplateApi({
  action: ApiActions.processPermits,
  externalDataId: 'permitOptions',
})

export const InnaApi = defineTemplateApi({
  action: 'getInnaDiplomas',
  externalDataId: 'innaEducation',
  namespace: 'EducationShared',
  params: {
    allowEmpty: true,
  },
})
