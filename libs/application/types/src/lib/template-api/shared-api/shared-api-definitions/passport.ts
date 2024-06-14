import { defineTemplateApi } from '../../TemplateApi'
import { IdentityDocumentTypes } from '@island.is/clients/passports'

export interface PassportsParameters {
  type?: IdentityDocumentTypes
}

export const PassportsApi = defineTemplateApi<PassportsParameters>({
  action: 'identityDocument',
  namespace: 'IdentityDocument',
})
