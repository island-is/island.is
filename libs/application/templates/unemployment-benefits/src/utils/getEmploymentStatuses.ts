import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { EmploymentStatus } from '../shared'

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
