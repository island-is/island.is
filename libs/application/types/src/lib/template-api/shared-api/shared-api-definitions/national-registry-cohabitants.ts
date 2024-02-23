import { defineTemplateApi } from '../../TemplateApi'

export const NationalRegistryCohabitantsApi = defineTemplateApi({
  action: 'getCohabitantsDetailed',
  namespace: 'NationalRegistry',
  externalDataId: 'nationalRegistryCohabitants',
})
