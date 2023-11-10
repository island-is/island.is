import { defineTemplateApi } from '@island.is/application/types'

export {
  NationalRegistryUserApi,
  UserProfileApi,
  NationalRegistrySpouseApi,
} from '@island.is/application/types'

export const NationalRegistryResidenceHistoryApi = defineTemplateApi({
  action: 'getResidenceHistory',
  externalDataId: 'nationalRegistryResidenceHistory',
  namespace: 'NationalRegistry',
})

export const NationalRegistryCohabitantsApi = defineTemplateApi({
  action: 'getCohabitants',
  externalDataId: 'nationalRegistryCohabitants',
  namespace: 'NationalRegistry',
})

export const SocialInsuranceAdministrationBankInfoApi = defineTemplateApi({
  action: 'getBankInfo',
  externalDataId: 'socialInsuranceAdministrationBankInfo',
})

export const SocialInsuranceAdministrationSpouseInNursingHomeApi =
  defineTemplateApi({
    action: 'getSpouseInNursingHome',
    externalDataId: 'socialInsuranceAdministrationSpouseInNursingHome',
  })

export const SocialInsuranceAdministrationIsApplicantEligibleApi =
  defineTemplateApi({
    action: 'getIsEligible',
    externalDataId: 'socialInsuranceAdministrationIsApplicantEligible',
  })
