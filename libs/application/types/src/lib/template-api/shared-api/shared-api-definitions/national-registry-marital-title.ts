import { defineTemplateApi } from '../../TemplateApi'

export const NationalRegistryMaritalTitleApi = defineTemplateApi({
  action: 'getMaritalTitle',
  externalDataId: 'nationalRegistryMaritalTitle',
  namespace: 'NationalRegistry',
})
