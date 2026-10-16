import { ExternalData } from '@island.is/application/types'
import { Routes } from './constants'
import { ApproveOptions, FAApplication, TaxData } from './types'
import { getFinancialAidRouting } from './utils'

type SummaryApplication = Pick<FAApplication, 'answers' | 'externalData'>

export const isVeitaApplication = ({ externalData }: SummaryApplication) =>
  getFinancialAidRouting(externalData as unknown as ExternalData).backend ===
  'veita'

// Mirrors the tax return files section conditions in the applicant and spouse forms.
const needsTaxReturnFiles = (taxData?: TaxData) =>
  taxData?.municipalitiesDirectTaxPayments?.success === false ||
  taxData?.municipalitiesPersonalTaxReturn?.personalTaxReturn == null

// goToScreen only matches top-level screen ids and does not check visibility,
// so these must be screens shown on the Veita route. When no upload screen
// applies, the income question is where files can be added.
export const getVeitaFilesRoute = ({
  answers,
  externalData,
}: SummaryApplication): Routes => {
  const hasChildren = (externalData.childrenCustodyInformation?.data ?? [])
    .length
  if (hasChildren && (answers.rvkChildrenFiles?.length ?? 0) > 0) {
    return Routes.RVKCHILDRENFILES
  }
  if (answers.income === ApproveOptions.Yes) {
    return Routes.INCOMEFILESTAXSUCCESS
  }
  if (needsTaxReturnFiles(externalData.taxData?.data)) {
    return Routes.RVKTAXRETURNFILESMULTIFIELD
  }
  return Routes.INCOMEMULTIFIELD
}

export const getVeitaSpouseFilesRoute = ({
  answers,
  externalData,
}: SummaryApplication): Routes => {
  if (answers.spouseIncome === ApproveOptions.Yes) {
    return Routes.RVKSPOUSEINCOMEFILES
  }
  if (needsTaxReturnFiles(externalData.taxDataSpouse?.data)) {
    return Routes.RVKSPOUSETAXRETURNFILESMULTIFIELD
  }
  return Routes.INCOMEMULTIFIELD
}
