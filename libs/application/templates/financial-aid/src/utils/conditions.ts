import {
  ApplicantChildCustodyInformation,
  ExternalData,
  FormValue,
  NationalRegistrySpouse,
} from '@island.is/application/types'
import { ApproveOptions } from '../lib/types'
import { getValueViaPath } from '@island.is/application/core'
import {
  Employment,
  HomeCircumstances,
} from '@island.is/financial-aid/shared/lib'
import { getFinancialAidRouting } from '../lib/utils'

export const hasSpouse = (_answers: FormValue, externalData: ExternalData) =>
  getValueViaPath<NationalRegistrySpouse>(
    externalData,
    'nationalRegistrySpouse.data',
  ) != null

export const hasNoSpouse = (_answers: FormValue, externalData: ExternalData) =>
  getValueViaPath<NationalRegistrySpouse>(
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

export const isVeitaMunicipality = (
  _answers: FormValue,
  externalData: ExternalData,
) => getFinancialAidRouting(externalData).backend === 'veita'

export const taxSuccess = (_answers: FormValue, externalData: ExternalData) =>
  getValueViaPath<boolean>(
    externalData,
    'taxData.data.municipalitiesDirectTaxPayments.success',
  ) === true

export const hasOtherHomeCircumstances = (answers: FormValue) =>
  getValueViaPath<HomeCircumstances>(answers, 'homeCircumstances.type') ===
  HomeCircumstances.OTHER

export const isStudent = (answers: FormValue) =>
  getValueViaPath<ApproveOptions>(answers, 'student.isStudent') ===
  ApproveOptions.Yes

export const otherEmployment = (answers: FormValue) =>
  getValueViaPath<Employment>(answers, 'employment.type') === Employment.OTHER
