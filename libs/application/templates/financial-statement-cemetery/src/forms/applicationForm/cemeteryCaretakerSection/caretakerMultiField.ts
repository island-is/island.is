import { buildCustomField, buildMultiField } from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { CEMETERYCARETAKER } from '../../../utils/constants'

export const caretakerMultiField = buildMultiField({
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
})
