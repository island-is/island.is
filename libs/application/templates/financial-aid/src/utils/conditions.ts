import {
  ApplicantChildCustodyInformation,
  ExternalData,
  FormValue,
  NationalRegistrySpouseV3,
} from '@island.is/application/types'
import { ApproveOptions } from '..'
import { getValueViaPath } from '@island.is/application/core'
import {
  Employment,
  HomeCircumstances,
} from '@island.is/financial-aid/shared/lib'

export const hasSpouse = (_answers: FormValue, externalData: ExternalData) =>
  getValueViaPath<NationalRegistrySpouseV3>(
    externalData,
    'nationalRegistrySpouse.data',
  ) != null

export const hasNoSpouse = (_answers: FormValue, externalData: ExternalData) =>
  getValueViaPath<NationalRegistrySpouseV3>(
    externalData,
    'nationalRegistrySpouse.data',
  ) == null

export const isInRelationship = (answers: FormValue) =>
  getValueViaPath<ApproveOptions>(
    answers,
    'relationshipStatus.unregisteredCohabitation',
  ) === ApproveOptions.Yes

export const hasChildren = (
  _answers: FormValue,
  externalData: ExternalData,
) => {
  const childWithInfo = getValueViaPath<ApplicantChildCustodyInformation[]>(
    externalData,
    'childrenCustodyInformation.data',
    [],
  )
  return Boolean(childWithInfo?.length)
}

export const hasOtherHomeCircumstances = (answers: FormValue) =>
  getValueViaPath<HomeCircumstances>(answers, 'homeCircumstances.type') ===
  HomeCircumstances.OTHER

export const isStudent = (answers: FormValue) =>
  getValueViaPath<ApproveOptions>(answers, 'student.isStudent') ===
  ApproveOptions.Yes

export const otherEmployment = (answers: FormValue) =>
  getValueViaPath<Employment>(answers, 'employment.type') === Employment.OTHER
