import { defineTemplateApi } from '@island.is/application/types'

export {
  NationalRegistryUserApi,
  NationalRegistrySpouseApi,
} from '@island.is/application/types'

export const SocialInsuranceAdministrationApplicantApi = defineTemplateApi({
  action: 'getApplicant',
  externalDataId: 'socialInsuranceAdministrationApplicant',
  namespace: 'SocialInsuranceAdministration',
})

export const SocialInsuranceAdministrationChildrenApi = defineTemplateApi({
  action: 'getChildrenWithSameDomicile',
  externalDataId: 'socialInsuranceAdministrationChildren',
  namespace: 'SocialInsuranceAdministration',
})
