import { FormValue } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import { CareTaker } from '../types/types'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { format as formatNationalId } from 'kennitala'
import { formatCurrency } from './currency'

export const getOverviewNumbers = (answers: FormValue) => {
  const file = getValueViaPath<Array<File>>(answers, 'attachments.file')
  const fileName = file?.[0]?.name
  const incomeLimit =
    getValueViaPath<string>(answers, 'cemeteryOperations.incomeLimit') ?? '0'
  const email = getValueViaPath<string>(answers, 'about.email')
  const careIncome = getValueViaPath<string>(
    answers,
    'cemeteryIncome.careIncome',
  )
  const cemeteryCaretakers = getValueViaPath<Array<CareTaker>>(
    answers,
    'cemeteryCaretaker',
  )
  const burialRevenue = getValueViaPath<string>(
    answers,
    'cemeteryIncome.burialRevenue',
  )
  const grantFromTheCemeteryFund = getValueViaPath<string>(
    answers,
    'cemeteryIncome.grantFromTheCemeteryFund',
  )
  const otherIncome = getValueViaPath<string>(
    answers,
    'cemeteryIncome.otherIncome',
  )
  const totalIncome = getValueViaPath<string>(answers, 'cemeteryIncome.total')

  const payroll = getValueViaPath<string>(answers, 'cemeteryExpense.payroll')
  const funeralCost = getValueViaPath<string>(
    answers,
    'cemeteryExpense.funeralCost',
  )
  const chapelExpense = getValueViaPath<string>(
    answers,
    'cemeteryExpense.chapelExpense',
  )
  const donationsToCemeteryFund = getValueViaPath<string>(
    answers,
    'cemeteryExpense.cemeteryFundExpense',
  )
  const donationsToOther = getValueViaPath<string>(
    answers,
    'cemeteryExpense.donationsToOther',
  )
  const otherOperationCost = getValueViaPath<string>(
    answers,
    'cemeteryExpense.otherOperationCost',
  )
  const depreciation = getValueViaPath<string>(
    answers,
    'cemeteryExpense.depreciation',
  )
  const totalExpenses = getValueViaPath<string>(
    answers,
    'cemeteryExpense.total',
  )

  const fixedAssetsTotal = getValueViaPath<string>(
    answers,
    'cemeteryAsset.fixedAssetsTotal',
  )
  const currentAssets = getValueViaPath<string>(
    answers,
    'cemeteryAsset.currentAssets',
  )
  const totalAssets = getValueViaPath<string>(answers, 'assetsTotal')

  const longTerm = getValueViaPath<string>(
    answers,
    'cemeteryLiability.longTerm',
  )
  const shortTerm = getValueViaPath<string>(
    answers,
    'cemeteryLiability.shortTerm',
  )
  const totalLiabilities = getValueViaPath<string>(
    answers,
    'equityAndLiabilitiesTotals.liabilitiesTotal',
  )

  const equityAtTheBeginningOfTheYear = getValueViaPath<string>(
    answers,
    'cemeteryEquity.equityAtTheBeginningOfTheYear',
  )
  const revaluationDueToPriceChanges = getValueViaPath<string>(
    answers,
    'cemeteryEquity.revaluationDueToPriceChanges',
  )
  const reevaluateOther = getValueViaPath<string>(
    answers,
    'cemeteryEquity.reevaluateOther',
  )
  const operationResult = getValueViaPath<string>(
    answers,
    'cemeteryEquity.operationResult',
  )
  const totalEquity = getValueViaPath<string>(answers, 'cemeteryEquity.total')

  const debtsAndCash = getValueViaPath<string>(
    answers,
    'equityAndLiabilitiesTotals.equityAndLiabilitiesTotal',
  )

  return {
    file,
    fileName,
    incomeLimit,
    email,
    cemeteryCaretakers,
    careIncome,
    burialRevenue,
    grantFromTheCemeteryFund,
    otherIncome,
    totalIncome,
    payroll,
    funeralCost,
    chapelExpense,
    donationsToCemeteryFund,
    donationsToOther,
    otherOperationCost,
    depreciation,
    totalExpenses,
    fixedAssetsTotal,
    currentAssets,
    totalAssets,
    longTerm,
    shortTerm,
    totalLiabilities,
    equityAtTheBeginningOfTheYear,
    revaluationDueToPriceChanges,
    reevaluateOther,
    operationResult,
    totalEquity,
    debtsAndCash,
  }
}

export const getAboutOverviewNumbers = (answers: FormValue) => {
  const fullName = getValueViaPath<string>(answers, 'about.fullName')
  const nationalId = formatNationalId(
    getValueViaPath<string>(answers, 'about.nationalId') ?? '',
  )
  const powerOfAttorneyName = getValueViaPath<string>(
    answers,
    'about.powerOfAttorneyName',
  )
  const powerOfAttorneyNationalId = formatNationalId(
    getValueViaPath<string>(answers, 'about.powerOfAttorneyNationalId') ?? '',
  )
  const email = getValueViaPath<string>(answers, 'about.email')
  const phoneNumber = formatPhoneNumber(
    getValueViaPath<string>(answers, 'about.phoneNumber') ?? '',
  )

  return {
    fullName,
    nationalId,
    powerOfAttorneyName,
    powerOfAttorneyNationalId,
    email,
    phoneNumber,
  }
}

export const getCapitalNumbersOverviewNumbers = (answers: FormValue) => {
  const capitalIncome = formatCurrency(
    getValueViaPath<string>(answers, 'capitalNumbers.capitalIncome'),
  )
  const capitalCost = formatCurrency(
    getValueViaPath<string>(answers, 'capitalNumbers.capitalCost'),
  )
  const totalCapital = formatCurrency(
    getValueViaPath<string>(answers, 'capitalNumbers.total'),
  )

  return {
    capitalIncome,
    capitalCost,
    totalCapital,
  }
}

export const showInfoAllertInOverview = (answers: FormValue) => {
  const { totalIncome, fixedAssetsTotal, longTerm, incomeLimit } =
    getOverviewNumbers(answers)

  return (
    Number(totalIncome) < Number(incomeLimit) &&
    fixedAssetsTotal === '0' &&
    longTerm === '0'
  )
}
