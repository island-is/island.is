import {
  buildCustomField,
  buildSection,
  buildMultiField,
} from '@island.is/application/core'
import { CEMETRYCARETAKER, USERTYPE } from '../../../lib/constants'
import { m } from '../../../lib/messages'
import { FinancialStatementsInao } from '../../../lib/utils/dataSchema'
import {
  currencyStringToNumber,
  getCurrentUserType,
} from '../../../lib/utils/helpers'

export const sectionCemetryCaretaker = buildSection({
  id: 'cemetryCaretaker',
  title: m.cemeteryCaretakers,
  condition: (answers, externalData) => {
    const userType = getCurrentUserType(answers, externalData)
    if (userType !== USERTYPE.CEMETRY) {
      return false
    }
    const applicationAnswers = answers as FinancialStatementsInao
    const careTakerLimit =
      applicationAnswers.cemetryOperation?.incomeLimit ?? '0'
    const currentAssets = applicationAnswers.cemetryAsset?.current
    const totalIncome = applicationAnswers.operatingCost?.total
    const longTermDebt = applicationAnswers.cemetryLiability?.longTerm
    const isUnderLimit =
      currencyStringToNumber(totalIncome) <= Number(careTakerLimit)
    return isUnderLimit && currentAssets === '0' && longTermDebt === '0'
  },
  children: [
    buildMultiField({
      id: 'caretakers',
      title: m.cemeteryBoardmembers,
      description: m.cemeteryRegisterCaretakers,
      children: [
        buildCustomField({
          id: 'cemetryCaretaker',
          title: m.cemeteryBoardmembers,
          component: 'CemetryCaretaker',
          childInputIds: Object.values(CEMETRYCARETAKER),
        }),
      ],
    }),
  ],
})
