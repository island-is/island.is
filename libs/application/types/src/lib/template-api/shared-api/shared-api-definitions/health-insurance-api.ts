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
