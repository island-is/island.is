import React from 'react'
import { useIntl } from 'react-intl'

import { CaseAppealRulingDecision } from '@island.is/judicial-system/types'

import { appealRuling } from '@island.is/judicial-system-web/messages/Core/appealRuling'
import { Tag } from '@island.is/island-ui/core'

const TagAppealRuling: React.FC = () => {
  const { formatMessage } = useIntl()

  const getTagVariantForAppealRulingDecision = (
    appealRulingDecision?: CaseAppealRulingDecision,
  ) => {
    if (appealRulingDecision === CaseAppealRulingDecision.ACCEPTING) {
      return {
        color: 'mint',
        text: formatMessage(appealRuling.tagDecisionAccept),
      }
    }
    if (appealRulingDecision === CaseAppealRulingDecision.REPEAL) {
      return {
        color: 'rose',
        text: formatMessage(appealRuling.tagDecisionChange),
      }
    }
    if (appealRulingDecision === CaseAppealRulingDecision.CHANGED) {
      return {
        color: 'rose',
        text: formatMessage(appealRuling.tagDecisionChange),
      }
    }
    if (
      appealRulingDecision ===
      CaseAppealRulingDecision.DISMISSED_FROM_COURT_OF_APPEAL
    ) {
      return {
        color: 'blueberry',
        text: formatMessage(appealRuling.tagDecisionDismissed),
      }
    }
    if (
      appealRulingDecision === CaseAppealRulingDecision.DISMISSED_FROM_COURT
    ) {
      return {
        color: 'blueberry',
        text: formatMessage(appealRuling.tagDecisionDismissed),
      }
    }
    if (appealRulingDecision === CaseAppealRulingDecision.REMAND) {
      return {
        color: 'blueberry',
        text: formatMessage(appealRuling.tagDecisionRemand),
      }
    }
    return undefined
  }

  const tagVariantRuling = getTagVariantForAppealRulingDecision(
    CaseAppealRulingDecision.REMAND,
  )

  if (!tagVariantRuling) {
    return null
  }
  return (
    <Tag variant={tagVariantRuling?.color} outlined disabled>
      {tagVariantRuling.text}
    </Tag>
  )
}

export default TagAppealRuling
