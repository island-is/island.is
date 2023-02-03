import { defineTemplateApi } from '../..'

export interface ApplicationHistoryParameters {
  contentId: string
}

export const ApplicationHistoryApi = defineTemplateApi<ApplicationHistoryParameters>(
  {
    action: 'createHistoryEntry',
    namespace: 'Application',
  },
)
