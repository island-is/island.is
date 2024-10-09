import { buildMultiField, buildRadioField } from '@island.is/application/core'
import { whoIsTheNotificationFor } from '../../../lib/messages'
import {
  whoIsTheNotificationForOptions,
  whoIsTheNotificationForProcureOptions,
} from '../../../utils/getWhoIstheNotificationForOptions'

export const whoIsTheNotificationForMultiField = buildMultiField({
  id: 'whoIsTheNotificationFor',
  title: whoIsTheNotificationFor.general.heading,
  description: (application) => {
    if (application.externalData.identity) {
      return whoIsTheNotificationFor.general.procureDescription
    }
    return whoIsTheNotificationFor.general.description
  },
  children: [
    buildRadioField({
      id: 'whoIsTheNotificationFor.answer',
      title: '',
      width: 'half',
      condition: (_answers, externalData) => {
        if (externalData.identity) {
          return false
        }
        return true
      },
      options: whoIsTheNotificationForOptions,
    }),
    buildRadioField({
      id: 'whoIsTheNotificationFor.answer',
      title: '',
      width: 'half',
      condition: (_answers, externalData) => {
        if (externalData.identity) {
          return true
        }
        return false
      },
      options: whoIsTheNotificationForProcureOptions,
    }),
  ],
})
