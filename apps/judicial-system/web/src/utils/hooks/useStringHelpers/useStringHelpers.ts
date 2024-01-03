import { useIntl } from 'react-intl'

import { sections } from '@island.is/judicial-system-web/messages'
import { CaseAppealRulingDecision } from '@island.is/judicial-system-web/src/graphql/schema'

import { useStringHelpersStrings as strings } from './useStringHelpers.strings'

/**
 * This hook contains helper functions for strings. The reason for it
 * being a hook, instead of a simple utility function, is that it
 * it uses hooks internally, f.x. the useIntl hook.
 */
const useStringHelpers = () => {
  const { formatMessage } = useIntl()

  const getAppealResultText = (
    appealResult?: CaseAppealRulingDecision | null,
  ) => {
    switch (appealResult) {
      case CaseAppealRulingDecision.ACCEPTING:
        return formatMessage(strings.decisionAccept)
      case CaseAppealRulingDecision.REPEAL:
      case CaseAppealRulingDecision.CHANGED:
        return formatMessage(strings.decisionChange)
      case CaseAppealRulingDecision.DISMISSED_FROM_COURT_OF_APPEAL:
      case CaseAppealRulingDecision.DISMISSED_FROM_COURT:
        return formatMessage(strings.decisionDismissed)
      case CaseAppealRulingDecision.REMAND:
        return formatMessage(strings.decisionRemand)
      default:
        return formatMessage(sections.caseResults.result)
    }
  }

  return {
    getAppealResultText,
  }
}

export default useStringHelpers
