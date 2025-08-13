import { whoIsTheNotificationFor } from '../lib/messages'
import { FormValue } from '@island.is/application/types'
import { accidentType } from '../lib/messages'
import {
  isReportingOnBehalfOfChild,
  isReportingOnBehalfOfEmployee,
} from './reportingUtils'
import { AccidentTypeEnum, WhoIsTheNotificationForEnum } from './enums'

export const getAccidentTypeOptions = (answers: FormValue) => {
  const options = [
    {
      value: AccidentTypeEnum.WORK,
      label: accidentType.labels.work,
    },
    {
      value: AccidentTypeEnum.RESCUEWORK,
      label: accidentType.labels.rescueWork,
    },
    {
      value: AccidentTypeEnum.STUDIES,
      label: accidentType.labels.studies,
    },
    {
      value: AccidentTypeEnum.SPORTS,
      label: accidentType.labels.sports,
    },
  ]

  if (
    !isReportingOnBehalfOfEmployee(answers) &&
    !isReportingOnBehalfOfChild(answers)
  ) {
    options.unshift({
      value: AccidentTypeEnum.HOMEACTIVITIES,
      label: accidentType.labels.homeActivities,
    })
  }

  return options
}

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
