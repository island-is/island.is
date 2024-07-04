import { defineTemplateApi } from '../../TemplateApi'

export const HealthInsuranceApi = defineTemplateApi({
  action: 'isHealthInsured',
  namespace: 'HealthInsurance',
})

export const HealthCenterApi = defineTemplateApi({
  action: 'getCurrentHealthcenter',
  namespace: 'Healthcenter',
  externalDataId: 'currentHealthcenter',
})

export const HealthInsuranceStatementsApi = defineTemplateApi({
  action: 'getInsuranceStatementData',
  order: 1,
  throwOnError: true,
  namespace: 'HealthInsuranceDeclaration',
  externalDataId: 'insuranceStatementData',
})
