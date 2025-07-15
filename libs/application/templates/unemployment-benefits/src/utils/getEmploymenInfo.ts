import { getValueViaPath, YES } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import { EmploymentStatus } from '../shared'
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

  //TODO REVERT
  return [
    { employerSSN: '1234567890', employer: 'Test Company' },
    { employerSSN: '-', employer: 'Annað' },
  ] // Temporary mock data for testing
  // return employmentList
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
