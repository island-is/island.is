import { defineTemplateApi } from '../../TemplateApi'

export interface ExistingApplicatiosnParameters {
    states: string[]
  }
  
export const ExistingApplicationApi = defineTemplateApi<ExistingApplicatiosnParameters>({
    action: 'existingApplication',
    namespace: 'Application'
})