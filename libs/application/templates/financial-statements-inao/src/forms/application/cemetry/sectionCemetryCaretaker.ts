import {
  buildCustomField,
  buildSection,
  buildMultiField,
} from '@island.is/application/core'
import { CEMETRYCARETAKER } from '../../../lib/constants'
import { m } from '../../../lib/messages'
import { FinancialStatementsInao } from '../../../lib/utils/dataSchema'
import {
  currencyStringToNumber,
  getCurrentUserType,
} from '../../../lib/utils/helpers'
import { FSIUSERTYPE } from '../../../types'

export const sectionCemetryCaretaker = buildSection({
  id: 'cemetryCaretakerSection',
  title: m.cemeteryCaretakers,
  condition: (answers, externalData) => {
    const userType = getCurrentUserType(answers, externalData)
    if (userType !== FSIUSERTYPE.CEMETRY) {
      return false
    }
    const applicationAnswers = answers as FinancialStatementsInao
    const careTakerLimit =
      applicationAnswers.cemetryOperation?.incomeLimit ?? '0'
    const fixedAssetsTotal = applicationAnswers.cemetryAsset?.fixedAssetsTotal
    const totalIncome = applicationAnswers.cemetryIncome?.total
    const longTermDebt = applicationAnswers.cemetryLiability?.longTerm
    const isUnderLimit =
      Number(currencyStringToNumber(totalIncome)) <= Number(careTakerLimit)
    return isUnderLimit && fixedAssetsTotal === '0' && longTermDebt === '0'
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
