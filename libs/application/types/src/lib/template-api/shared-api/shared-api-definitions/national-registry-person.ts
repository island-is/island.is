import { defineTemplateApi } from '../../TemplateApi'

export const NationalRegistryPersonApi = defineTemplateApi({
  action: 'getPerson',
  namespace: 'NationalRegistry',
  externalDataId: 'person',
})
