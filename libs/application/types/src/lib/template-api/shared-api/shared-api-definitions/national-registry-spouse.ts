import { defineTemplateApi } from '../../TemplateApi'

export const NationalRegistrySpouseApi = defineTemplateApi({
  action: 'getSpouse',
  namespace: 'NationalRegistry',
  externalDataId: 'nationalRegistrySpouse',
})
