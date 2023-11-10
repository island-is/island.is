import { defineTemplateApi } from '../../TemplateApi'

export const IdentityApi = defineTemplateApi({
  action: 'identity',
  namespace: 'Identity',
})

export const IdentityApi2 = defineTemplateApi({
  action: 'identity2',
  namespace: 'Identity',
  externalDataId: 'identity',
})
