import { IntlShape } from 'react-intl'

import { isAcceptingCaseDecision } from '@island.is/judicial-system/types'
import { rcCourtRecord } from '@island.is/judicial-system-web/messages'
import {
  Case,
  CaseDecision,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { formatCustodyRestrictions } from '@island.is/judicial-system-web/src/utils/restrictions'

export const populateEndOfCourtSessionForRestrictions = (
  workingCase: Case,
  endOfSessionBookings: string[],
  formatMessage: IntlShape['formatMessage'],
) => {
  if (
    workingCase.type === CaseType.CUSTODY ||
    workingCase.type === CaseType.ADMISSION_TO_FACILITY
  ) {
    if (
      isAcceptingCaseDecision(workingCase.decision) ||
      workingCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
    ) {
      if (isAcceptingCaseDecision(workingCase.decision)) {
        const formattedRestrictions = formatCustodyRestrictions(
          formatMessage,
          workingCase.type,
          workingCase.requestedCustodyRestrictions,
        )

        if (formattedRestrictions) {
          endOfSessionBookings.push(formattedRestrictions, '\n\n')
        }
      }

      endOfSessionBookings.push(
        formatMessage(rcCourtRecord.sections.custodyRestrictions.disclaimerV2, {
          caseType:
            workingCase.decision ===
            CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
              ? CaseType.TRAVEL_BAN
              : workingCase.type,
        }),
      )
    }
  } else if (workingCase.type === CaseType.TRAVEL_BAN) {
    if (
      isAcceptingCaseDecision(workingCase.decision) &&
      workingCase.requestedOtherRestrictions
    ) {
      endOfSessionBookings.push(
        `${
          workingCase.requestedOtherRestrictions &&
          `${workingCase.requestedOtherRestrictions}\n\n`
        }${formatMessage(
          rcCourtRecord.sections.custodyRestrictions.disclaimerV2,
          {
            caseType: workingCase.type,
          },
        )}`,
      )
    }
  }
}
