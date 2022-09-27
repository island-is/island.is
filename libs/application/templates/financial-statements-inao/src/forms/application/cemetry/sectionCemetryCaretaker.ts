import {
  buildCustomField,
  buildSection,
  buildMultiField,
} from '@island.is/application/core'
import {
  CARETAKERLIMIT,
  CEMETRYCARETAKER,
  USERTYPE,
} from '../../../lib/constants'
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
    const currentAssets = applicationAnswers.cemetryAsset?.current
    const totalIncome = applicationAnswers.operatingCost?.total
    const longTermDebt = applicationAnswers.cemetryLiability?.longTerm
    const isUnderLimit = currencyStringToNumber(totalIncome) < CARETAKERLIMIT
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
