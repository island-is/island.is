import { defineTemplateApi } from '../../TemplateApi'

export const NationalRegistrySpouseApi = defineTemplateApi({
  action: 'getSpouse',
  namespace: 'NationalRegistry',
  externalDataId: 'nationalRegistrySpouse',
})

export const NationalRegistryV3SpouseApi = defineTemplateApi({
  action: 'getSpouse',
  namespace: 'NationalRegistryV3',
  externalDataId: 'nationalRegistrySpouse',
})
