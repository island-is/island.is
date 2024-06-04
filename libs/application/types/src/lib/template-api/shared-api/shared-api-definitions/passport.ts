import { defineTemplateApi } from '../../TemplateApi'

export interface PassportsParameters {
  type?: string
}

export const PassportsApi = defineTemplateApi<PassportsParameters>({
  action: 'identityDocument',
  namespace: 'IdentityDocument',
})
