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

const taxDataPath = (isSpouse: boolean) =>
  isSpouse ? 'taxDataSpouse.data' : 'taxData.data'

// RSK leaves the tax return undefined while the municipalities backend uses
// null, so both have to count as a failed fetch.
export const taxReturnFailed = (externalData: ExternalData, isSpouse = false) =>
  getValueViaPath(
    externalData,
    `${taxDataPath(
      isSpouse,
    )}.municipalitiesPersonalTaxReturn.personalTaxReturn`,
  ) == null

export const directTaxPaymentsFailed = (
  externalData: ExternalData,
  isSpouse = false,
) =>
  getValueViaPath<boolean>(
    externalData,
    `${taxDataPath(isSpouse)}.municipalitiesDirectTaxPayments.success`,
  ) === false

export const needsTaxFiles = (externalData: ExternalData, isSpouse = false) =>
  taxReturnFailed(externalData, isSpouse) ||
  directTaxPaymentsFailed(externalData, isSpouse)

export const hasOtherHomeCircumstances = (answers: FormValue) =>
  getValueViaPath<HomeCircumstances>(answers, 'homeCircumstances.type') ===
  HomeCircumstances.OTHER

export const isStudent = (answers: FormValue) =>
  getValueViaPath<ApproveOptions>(answers, 'student.isStudent') ===
  ApproveOptions.Yes

export const otherEmployment = (answers: FormValue) =>
  getValueViaPath<Employment>(answers, 'employment.type') === Employment.OTHER
