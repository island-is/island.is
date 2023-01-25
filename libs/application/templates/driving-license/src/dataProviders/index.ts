import { PaymentCatalogApi } from '@island.is/application/types'
import { SYSLUMADUR_NATIONAL_ID } from '../lib/constants'
export {
  NationalRegistryUserApi,
  HasTeachingRightsApi,
  UserProfileApi,
  CurrentLicenseApi,
  DrivingAssessmentApi,
  JuristictionApi,
  QualityPhotoApi,
  ExistingApplicationApi,
} from '@island.is/application/types'

export const SyslumadurPaymentCatalogApi = PaymentCatalogApi.configure({
  params: {
    organizationId: SYSLUMADUR_NATIONAL_ID,
  },
  externalDataId: 'payment',
})
