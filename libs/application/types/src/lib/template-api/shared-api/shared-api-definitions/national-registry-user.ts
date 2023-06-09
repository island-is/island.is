import { ProviderErrorReason } from '@island.is/shared/problem'
import { defineTemplateApi } from '../../TemplateApi'

export interface NationalRegistryParameters {
  ageToValidate?: number
  legalDomicileIceland?: boolean
  ageToValidateError?: ProviderErrorReason
}
export const NationalRegistryUserApi = defineTemplateApi<NationalRegistryParameters>(
  {
    action: 'nationalRegistry',
    namespace: 'NationalRegistry',
    externalDataId: 'nationalRegistry',
  },
)
