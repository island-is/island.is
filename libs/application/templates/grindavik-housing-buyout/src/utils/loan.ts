import { FormValue } from '@island.is/application/types'
import { GrindavikHousingBuyout } from '../lib/dataSchema'

export const calculateTotalLoanFromAnswers = (answers: FormValue) => {
  const loans = (answers as GrindavikHousingBuyout).loanProviders.loans
  return loans?.reduce((acc, loan) => acc + (Number(loan.status) || 0), 0) ?? 0
}
