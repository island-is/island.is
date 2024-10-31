import { getValueViaPath } from '@island.is/application/core'
import { WorkAccidentNotification } from '@island.is/application/templates/aosh/work-accident-notification'
import {
  ApplicationWithAttachments,
  FormValue,
} from '@island.is/application/types'

export const getDateAndTime = (
  date: string,
  hours: string,
  minutes: string,
): Date => {
  const finalDate = new Date(date)
  finalDate.setHours(
    parseInt(hours, 10), // hours
    parseInt(minutes, 10), // minutes
  )
  return finalDate
}

export const getValueList = (answers: FormValue, answer: string) => {
  const objectList = getValueViaPath(answers, answer, {}) as object

  return Object.values(objectList)
    .map((values: { label: string; value: string }[]) => {
      return values?.map(({ value }) => {
        return value
      })
    })
    .flat()
}

export const mapVictimData = (
  employee: WorkAccidentNotification['employee'][0],
  index: number,
  answers: WorkAccidentNotification,
  application: ApplicationWithAttachments,
) => {
  const physicalActivities = getValueList(
    application.answers,
    `circumstances[${index}].physicalActivities`,
  )
  const physicalActivitiesMostSerious = getValueViaPath(
    application.answers,
    `circumstances[${index}].physicalActivitiesMostSerious`,
    undefined,
  ) as string | undefined
  const workDeviations = getValueList(
    application.answers,
    `deviations[${index}].workDeviations`,
  )
  const workDeviationsMostSerious = getValueViaPath(
    application.answers,
    `deviations[${index}].workDeviationsMostSerious`,
    undefined,
  ) as string | undefined
  const contactModeOfInjury = getValueList(
    application.answers,
    `causeOfInjury[${index}].contactModeOfInjury`,
  )
  const contactModeOfInjuryMostSerious = getValueViaPath(
    application.answers,
    `causeOfInjury[${index}].contactModeOfInjuryMostSerious`,
    undefined,
  ) as string | undefined
  const partOfBodyInjured = getValueList(
    application.answers,
    `injuredBodyParts[${index}].partOfBodyInjured`,
  )
  const partOfBodyInjuredMostSerious = getValueViaPath(
    application.answers,
    `injuredBodyParts[${index}].partOfBodyInjuredMostSerious`,
    undefined,
  ) as string | undefined
  const typeOfInjury = getValueList(
    application.answers,
    `typeOfInjury[${index}].typeOfInjury`,
  )
  const typeOfInjuryMostSerious = getValueViaPath(
    application.answers,
    `typeOfInjury[${index}].typeOfInjuryMostSerious`,
    undefined,
  ) as string | undefined
  return {
    victimsSSN: employee.nationalField.nationalId,
    employmentStatusOfVictim: employee.employmentStatus
      ? parseInt(employee.employmentStatus, 10)
      : 0,
    employmentAgencySSN: employee.tempEmploymentSSN ?? '',
    startedEmploymentForCompany: new Date(employee.startDate),
    lengthOfEmployment: employee.employmentTime
      ? parseInt(employee.employmentTime, 10)
      : 0,
    percentageOfFullWorkTime: employee.employmentRate
      ? parseInt(employee.employmentRate, 10)
      : 0,
    workhourArrangement: employee.workhourArrangement
      ? parseInt(employee.workhourArrangement, 10)
      : 0,
    startOfWorkingDay: getDateAndTime(
      employee.startOfWorkdayDate,
      employee.startTime.slice(0, 2),
      employee.startTime.slice(2, 4),
    ),
    workStation: employee.workstation ? parseInt(employee.workstation, 10) : 0,
    victimsOccupation: employee.victimsOccupation.value,
    absenceDueToAccident: answers.absence[index]
      ? parseInt(answers.absence[index], 10)
      : 0,
    specificPhysicalActivities: physicalActivities,
    specificPhysicalActivityMostSevere:
      physicalActivitiesMostSerious ?? physicalActivities[0],
    workDeviations: workDeviations,
    workDeviationMostSevere: workDeviationsMostSerious ?? workDeviations[0],
    contactModeOfInjuries: contactModeOfInjury,
    contactModeOfInjuryMostSevere:
      contactModeOfInjuryMostSerious ?? contactModeOfInjury[0],
    partsOfBodyInjured: partOfBodyInjured,
    partOfBodyInjuredMostSevere:
      partOfBodyInjuredMostSerious ?? partOfBodyInjured[0],
    typesOfInjury: typeOfInjury,
    typeOfInjuryMostSevere: typeOfInjuryMostSerious ?? typeOfInjury[0],
  }
}
