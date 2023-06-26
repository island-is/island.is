import { defineTemplateApi } from '../../TemplateApi'

export const NationalRegistryRealEstateApi = defineTemplateApi({
  action: 'getMyRealEstates',
  namespace: 'NationalRegistry',
  externalDataId: 'nationalRegistryRealEstate',
})
