import { defineTemplateApi } from '../../TemplateApi'

export const NationalRegistryCohabitantsApi = defineTemplateApi({
  action: 'getCohabitantsDetailed',
  namespace: 'NationalRegistry',
  externalDataId: 'nationalRegistryCohabitants',
})

export const NationalRegistryV3CohabitantsApi = defineTemplateApi({
  action: 'getCohabitantsDetailed',
  namespace: 'NationalRegistryV3',
  externalDataId: 'nationalRegistryCohabitants',
})
