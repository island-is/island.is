import { defineTemplateApi } from '@island.is/application/types'

export {
  NationalRegistryUserApi,
  NationalRegistrySpouseApi,
  UserProfileApi,
} from '@island.is/application/types'

export const SocialInsuranceAdministrationIsApplicantEligibleApi =
  defineTemplateApi({
    action: 'getIsEligible',
    externalDataId: 'socialInsuranceAdministrationIsApplicantEligible',
    namespace: 'SocialInsuranceAdministration',
    order: 2,
  })

// This needs to run before eligible is called because if applicant isn't vskm at TR
// they register one in this call.
export const SocialInsuranceAdministrationApplicantApi = defineTemplateApi({
  action: 'getApplicant',
  externalDataId: 'socialInsuranceAdministrationApplicant',
  namespace: 'SocialInsuranceAdministration',
  order: 1,
})

export const SocialInsuranceAdministrationRehabilitationplanApi =
  defineTemplateApi({
    action: 'getRehabilitationplan',
    externalDataId: 'socialInsuranceAdministrationRehabilitationplan',
    namespace: 'SocialInsuranceAdministration',
  })
