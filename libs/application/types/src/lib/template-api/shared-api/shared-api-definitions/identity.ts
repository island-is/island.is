import { defineTemplateApi } from '../../TemplateApi'

export interface IdentityParameters {
  includeActorInfo?: boolean
}

export const IdentityApi = defineTemplateApi<IdentityParameters>({
  action: 'identity',
  namespace: 'Identity',
})
