import {
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { CEMETERYCARETAKER } from '../../../utils/constants'
import { isCemetryUnderFinancialLimit } from '../../../utils/helpers'

// This section should appear if the cemetries total income is under the income limit
export const cemeteryCaretekerSection = buildSection({
  condition: isCemetryUnderFinancialLimit,
  id: 'cemeteryCaretekerSection',
  title: m.cemeteryCaretakers,
  children: [
    buildMultiField({
      id: 'caretakers',
      title: m.cemeteryBoardmembers,
      description: m.cemeteryRegisterCaretakers,
      children: [
        buildCustomField({
          id: 'cemeteryCaretaker',
          title: m.cemeteryBoardmembers,
          component: 'CemeteryCaretaker',
          childInputIds: Object.values(CEMETERYCARETAKER),
        }),
      ],
    }),
  ],
})
