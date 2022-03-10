import { FormValue } from '@island.is/application/core'
import { accidentType } from '../lib/messages'
import { AccidentTypeEnum } from '../types'
import { isReportingOnBehalfOfChild } from './isReportingOnBehalfOfChild'
import { isReportingOnBehalfOfEmployee } from './isReportingOnBehalfOfEmployee'

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
