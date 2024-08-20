import { buildMultiField, buildRadioField } from '@island.is/application/core'
import { whoIsTheNotificationFor } from '../../../lib/messages'
import { WhoIsTheNotificationForEnum } from '../../../types'

export const whoIsTheNotificationForMultiField = buildMultiField({
  id: 'whoIsTheNotificationFor',
  title: whoIsTheNotificationFor.general.heading,
  description: whoIsTheNotificationFor.general.description,
  children: [
    buildRadioField({
      id: 'whoIsTheNotificationFor.answer',
      title: '',
      width: 'half',
      options: [
        {
          value: WhoIsTheNotificationForEnum.ME,
          label: whoIsTheNotificationFor.labels.me,
        },
        {
          value: WhoIsTheNotificationForEnum.POWEROFATTORNEY,
          label: whoIsTheNotificationFor.labels.powerOfAttorney,
        },
        {
          value: WhoIsTheNotificationForEnum.JURIDICALPERSON,
          label: whoIsTheNotificationFor.labels.juridicalPerson,
        },
        {
          value: WhoIsTheNotificationForEnum.CHILDINCUSTODY,
          label: whoIsTheNotificationFor.labels.childInCustody,
        },
      ],
    }),
  ],
})
