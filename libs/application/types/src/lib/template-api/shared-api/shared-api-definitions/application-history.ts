import { StaticText } from '@island.is/shared/types'
import { defineTemplateApi } from '../..'

export interface ApplicationHistoryParameters {
  contentId: StaticText
}

export const ApplicationHistoryApi =
  defineTemplateApi<ApplicationHistoryParameters>({
    action: 'createHistoryEntry',
    namespace: 'Application',
  })
