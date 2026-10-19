import { isRequestCase } from '@island.is/judicial-system/types'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'

// Request case defenders are assigned per defendant, and the case-level fields
// only mirror the most recently edited one, so falling back to them would show
// another defendant's defender for a defendant who has none.
export const getCaseDefenderFallback = (
  workingCase: Pick<
    WorkingCase,
    'type' | 'defenderName' | 'defenderEmail' | 'defenderPhoneNumber'
  >,
) =>
  isRequestCase(workingCase.type)
    ? {}
    : {
        name: workingCase.defenderName,
        email: workingCase.defenderEmail,
        phoneNumber: workingCase.defenderPhoneNumber,
      }
