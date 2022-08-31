import { defineTemplateApi, TemplateApi } from '@island.is/application/types'

export interface ReferenceParams {
  id: number
}

export const ReferenceDataApi = defineTemplateApi<ReferenceParams>({
  action: 'getReferenceData',
  params: {
    id: 12,
  },
})
