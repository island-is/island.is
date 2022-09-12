import { defineTemplateApi } from '../../TemplateApi'

export interface NationalRegistryParameters {
  ageToValidate?: number
}
export const NationalRegistryUserApi = defineTemplateApi<NationalRegistryParameters>(
  {
    action: 'getUser',
    namespace: 'NationalRegistry',
    externalDataId: 'nationalRegistry',
  },
)
