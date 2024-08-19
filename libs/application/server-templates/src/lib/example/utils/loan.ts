import { FormValue } from '@island.is/application/types'
import { GrindavikHousingBuyout } from '../dataSchema'
export const calculateTotalLoanFromAnswers = (answers: FormValue) => {
  const loans = answers.loans as GrindavikHousingBuyout['loans']
  return loans?.reduce((acc, loan) => acc + (Number(loan.status) || 0), 0) ?? 0
}
