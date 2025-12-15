import { defineTemplateApi } from '../../TemplateApi'

export const ChildrenCustodyInformationApi = defineTemplateApi({
  action: 'childrenCustodyInformation',
  namespace: 'NationalRegistry',
})

export const ChildrenCustodyInformationApiV3 = defineTemplateApi({
  action: 'childrenCustodyInformation',
  namespace: 'NationalRegistryV3',
})
