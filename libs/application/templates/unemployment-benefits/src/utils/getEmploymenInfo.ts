import { getValueViaPath, YES } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import { CurrentEmploymentInAnswers, EmploymentStatus } from '../shared'
import { GaldurDomainModelsApplicantsApplicantProfileDTOsJob } from '@island.is/clients/vmst-unemployment'

export const isUnemployed = (answers: FormValue) => {
  const status = getValueViaPath<string>(answers, 'currentSituation.status')
  return status === EmploymentStatus.UNEMPLOYED
}

export const isEmployedPartTime = (answers: FormValue) => {
  const status = getValueViaPath<string>(answers, 'currentSituation.status')
  return status === EmploymentStatus.PARTJOB
}
export const isEmployed = (answers: FormValue) => {
  const status = getValueViaPath<string>(answers, 'currentSituation.status')
  return status === EmploymentStatus.EMPLOYED
}
export const isOccasionallyEmployed = (answers: FormValue) => {
  const status = getValueViaPath<string>(answers, 'currentSituation.status')
  return status === EmploymentStatus.OCCASIONAL
}

export const isEmployedAtAll = (answers: FormValue) => {
  const status = getValueViaPath<string>(answers, 'currentSituation.status')
  return (
    status === EmploymentStatus.EMPLOYED ||
    status === EmploymentStatus.PARTJOB ||
    status === EmploymentStatus.OCCASIONAL
  )
}

export const hasEmployer = (answers: FormValue) => {
  const status = getValueViaPath<string>(answers, 'currentSituation.status')
  return (
    status === EmploymentStatus.EMPLOYED || status === EmploymentStatus.PARTJOB
  )
}

export const doesOwnResume = (answers: FormValue) => {
  const doesOwnResume = getValueViaPath<string>(answers, 'resume.doesOwnResume')
  return doesOwnResume === YES
}

export const getEmploymentFromRsk = (externalData: ExternalData) => {
  const employmentList =
    getValueViaPath<Array<GaldurDomainModelsApplicantsApplicantProfileDTOsJob>>(
      externalData,
      'unemploymentApplication.data.jobCareer.jobs',
      [],
    ) ?? []

  const extendedList = [
    ...employmentList,
    {
      employerSSN: '-',
      employer: 'Annað',
    },
  ]

  return extendedList
}

export const getEmployerNameFromSSN = (
  externalData: ExternalData,
  ssn: string,
) => {
  const employmentList = getEmploymentFromRsk(externalData)

  const employerName = employmentList.find(
    (job) => job.employerSSN === ssn,
  )?.employer

  return employerName || ''
}

export const hasDataFromCurrentStatusItem = (
  answers: FormValue,
  index?: number,
  currentStatusFieldItem?: keyof CurrentEmploymentInAnswers,
) => {
  const repeaterJobs =
    getValueViaPath<CurrentEmploymentInAnswers[]>(
      answers,
      'currentSituation.currentSituationRepeater',
      [],
    ) ?? []

  const status =
    getValueViaPath<EmploymentStatus>(
      answers,
      'currentSituation.status',
      undefined,
    ) ?? undefined

  if (index === undefined || currentStatusFieldItem === undefined) {
    return false
  }

  //check if there is a default value from repeaterJobs
  else if (
    repeaterJobs[index] &&
    repeaterJobs[index][currentStatusFieldItem] !== undefined &&
    status !== EmploymentStatus.UNEMPLOYED
  ) {
    return true
  }
  return false
}

export const hasDataFromCurrentStatus = (
  answers: FormValue,
  index?: number,
) => {
  const repeaterJobs =
    getValueViaPath<CurrentEmploymentInAnswers[]>(
      answers,
      'currentSituation.currentSituationRepeater',
      [],
    ) ?? []

  const status =
    getValueViaPath<EmploymentStatus>(
      answers,
      'currentSituation.status',
      undefined,
    ) ?? undefined

  if (index === undefined || status === EmploymentStatus.UNEMPLOYED) {
    return false
  }

  return !!repeaterJobs[index]
}

export const hasDataWithoutField = (
  answers: FormValue,
  index?: number,
  currentStatusFieldItem?: keyof CurrentEmploymentInAnswers,
) => {
  const repeaterJobs =
    getValueViaPath<CurrentEmploymentInAnswers[]>(
      answers,
      'currentSituation.currentSituationRepeater',
      [],
    ) ?? []

  const status =
    getValueViaPath<EmploymentStatus>(
      answers,
      'currentSituation.status',
      undefined,
    ) ?? undefined

  if (index === undefined || currentStatusFieldItem === undefined) {
    return false
  }

  //check if there is a default value from repeaterJobs
  else if (
    repeaterJobs[index] &&
    repeaterJobs[index][currentStatusFieldItem] === undefined &&
    status !== EmploymentStatus.UNEMPLOYED
  ) {
    return true
  }
  return false
}

export const getDefaultFromCurrentStatus = (
  answers: FormValue,
  index?: number,
  currentStatusFieldItem?: keyof CurrentEmploymentInAnswers,
) => {
  if (index === undefined || currentStatusFieldItem === undefined) {
    return ''
  }
  const repeaterJobs =
    getValueViaPath<CurrentEmploymentInAnswers[]>(
      answers,
      'currentSituation.currentSituationRepeater',
      [],
    ) ?? []

  const status =
    getValueViaPath<EmploymentStatus>(
      answers,
      'currentSituation.status',
      undefined,
    ) ?? undefined

  if (
    repeaterJobs.length === 0 ||
    !repeaterJobs[index] ||
    status === EmploymentStatus.UNEMPLOYED
  ) {
    return ''
  }

  return repeaterJobs[index][currentStatusFieldItem] || ''
}
