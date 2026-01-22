import { TagVariant } from '@island.is/island-ui/core'

import { CaseIndictmentRulingDecision } from '../../graphql/schema'
import { strings } from './CaseTag.strings'

export const getIndictmentRulingDecisionTag = (
  indictmentRulingDecision?: CaseIndictmentRulingDecision | null,
): {
  color: TagVariant
  text: { id: string; defaultMessage: string; description: string }
} => {
  switch (indictmentRulingDecision) {
    case CaseIndictmentRulingDecision.FINE:
      return { color: 'mint', text: strings.indictmentFine }
    case CaseIndictmentRulingDecision.CANCELLATION:
      return { color: 'rose', text: strings.indictmentCancellation }
    case CaseIndictmentRulingDecision.MERGE:
      return { color: 'rose', text: strings.merged }
    case CaseIndictmentRulingDecision.DISMISSAL:
      return { color: 'blue', text: strings.indictmentDismissal }
    case CaseIndictmentRulingDecision.RULING:
      return { color: 'darkerBlue', text: strings.indictmentRuling }
    case CaseIndictmentRulingDecision.WITHDRAWAL:
      return { color: 'rose', text: strings.indictmentWithdrawal }
    default:
      return { color: 'darkerBlue', text: strings.complete }
  }
}
