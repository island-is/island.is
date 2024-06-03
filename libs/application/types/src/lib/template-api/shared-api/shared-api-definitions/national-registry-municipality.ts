import { defineTemplateApi } from '../../TemplateApi'

export const NationalRegistryMunicipalityCodesApi = defineTemplateApi({
  action: 'getMunicipalities',
  externalDataId: 'municipalities',
  namespace: 'NationalRegistry',
})
