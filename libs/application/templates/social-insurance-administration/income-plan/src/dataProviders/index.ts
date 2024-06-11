import { defineTemplateApi } from '@island.is/application/types'

export {
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'

export const SocialInsuranceAdministrationCategorizedIncomeTypesApi =
  defineTemplateApi({
    action: 'getCategorizedIncomeTypes',
    externalDataId: 'socialInsuranceAdministrationCategorizedIncomeTypes',
    namespace: 'SocialInsuranceAdministration',
  })

export const SocialInsuranceAdministrationCurrenciesApi = defineTemplateApi({
  action: 'getCurrencies',
  externalDataId: 'socialInsuranceAdministrationCurrencies',
  namespace: 'SocialInsuranceAdministration',
})

export const SocialInsuranceAdministrationWithholdingTaxApi = defineTemplateApi(
  {
    action: 'getWithholdingTax',
    externalDataId: 'socaialInsuranceAdministrationWithholdingTax',
    namespace: 'SocialInsuranceAdministration',
  },
)
