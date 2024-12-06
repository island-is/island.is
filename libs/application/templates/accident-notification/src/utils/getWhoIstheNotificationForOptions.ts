import { WhoIsTheNotificationForEnum } from '../types'
import { whoIsTheNotificationFor } from '../lib/messages'

export const whoIsTheNotificationForOptions = [
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
]

export const whoIsTheNotificationForProcureOptions = [
  {
    value: WhoIsTheNotificationForEnum.POWEROFATTORNEY,
    label: whoIsTheNotificationFor.labels.powerOfAttorneyProcure,
  },
  {
    value: WhoIsTheNotificationForEnum.JURIDICALPERSON,
    label: whoIsTheNotificationFor.labels.juridicalPerson,
  },
]
