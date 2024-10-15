import { getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  FormValue,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { ApproveOptions, TaxData } from '../../lib/types'
import { Routes } from '../../lib/constants'
import {
  DirectTaxPayment,
  PersonalTaxReturn,
} from '@island.is/financial-aid/shared/lib'
import { UploadFile } from '@island.is/island-ui/core'

export const getSpouseSummaryConstants = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const nationalId =
    (getValueViaPath(externalData, 'nationalRegistrySpouse.data.nationalId') as
      | string
      | undefined) ||
    (getValueViaPath(answers, 'relationshipStatus.spouseNationalId') as
      | string
      | undefined)

  const data = getValueViaPath(externalData, 'nationalRegistrySpouse.data') as
    | NationalRegistryIndividual
    | undefined

  const taxData = getValueViaPath(externalData, 'taxDataSpouse.data') as TaxData

  const sposeEmail = getValueViaPath(
    answers,
    'spouseContactInfo.email',
  ) as string

  const sposePhone = getValueViaPath(
    answers,
    'spouseContactInfo.phone',
  ) as string

  const spouseIncomeType = getValueViaPath(
    answers,
    'spouseIncome.type',
  ) as ApproveOptions

  const route =
    spouseIncomeType === ApproveOptions.Yes
      ? Routes.SPOUSEINCOMEFILES
      : Routes.SPOUSETAXRETURNFILES

  const personalTaxReturn = getValueViaPath(
    externalData,
    'taxDataSpouse.data.municipalitiesPersonalTaxReturn.personalTaxReturn',
  ) as PersonalTaxReturn

  const directTaxPayments = getValueViaPath(
    externalData,
    'taxDataSpouse.data.municipalitiesDirectTaxPayments.directTaxPayments',
  ) as DirectTaxPayment[]

  const fetchDate = getValueViaPath(
    externalData,
    'nationalRegistry?.date',
  ) as string

  const spouseTaxReturnFiles = getValueViaPath(
    answers,
    'spouseTaxReturnFiles',
  ) as Array<UploadFile>

  const spouseIncomeFiles = getValueViaPath(
    answers,
    'spouseIncomeFiles',
  ) as Array<UploadFile>

  return {
    nationalId,
    data,
    taxData,
    sposeEmail,
    sposePhone,
    route,
    personalTaxReturn,
    directTaxPayments,
    fetchDate,
    spouseTaxReturnFiles,
    spouseIncomeFiles,
  }
}
