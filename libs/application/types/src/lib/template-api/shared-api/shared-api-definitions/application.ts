import { defineTemplateApi } from '../../TemplateApi'

export interface ExistingApplicationParameters {
  states: string[]
  where: { [key: string]: string }
}

export const ExistingApplicationApi =
  defineTemplateApi<ExistingApplicationParameters>({
    action: 'existingApplication',
    namespace: 'Application',
  })

export const MockProviderApi = defineTemplateApi({
  action: 'mockProvider',
  namespace: 'Application',
})
