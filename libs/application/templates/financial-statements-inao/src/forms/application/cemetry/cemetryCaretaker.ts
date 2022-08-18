import {
  buildCustomField,
  buildSection,
  buildMultiField,
} from '@island.is/application/core'
import {
  CARETAKERLIMIT,
  CEMETRY,
  CEMETRYCARETAKER,
} from '../../../lib/constants'
import { m } from '../../../lib/messages'
import { FinancialStatementsInao } from '../../../lib/utils/dataSchema'

export const cemetryCaretaker = buildSection({
  id: 'cemetryCaretaker',
  title: m.cemeteryCaretakers,
  condition: (answers, externalData) => {
    /* @ts-ignore */
    const userType = externalData?.currentUserType?.data?.code
    const applicationAnswers = <FinancialStatementsInao>answers
    const totalIncome = applicationAnswers.cemetryIncome?.total
    return userType === CEMETRY && parseInt(totalIncome, 10) < CARETAKERLIMIT
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
