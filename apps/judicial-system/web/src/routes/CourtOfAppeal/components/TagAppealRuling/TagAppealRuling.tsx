import React from 'react'
import { useIntl } from 'react-intl'

import { CaseAppealRulingDecision } from '@island.is/judicial-system/types'

import { appealRuling } from '@island.is/judicial-system-web/messages/Core/appealRuling'
import { Tag, TagVariant } from '@island.is/island-ui/core'

interface Props {
  appealRulingDecision?: CaseAppealRulingDecision
}

const TagAppealRuling: React.FC<Props> = ({ appealRulingDecision }) => {
  const { formatMessage } = useIntl()

  if (!appealRulingDecision) return null

  const getTagVariantForAppealRulingDecision = (
    ruling: CaseAppealRulingDecision,
  ):
    | {
        color: TagVariant
        text: string
      }
    | undefined => {
    if (ruling === CaseAppealRulingDecision.ACCEPTING) {
      return {
        color: 'mint',
        text: formatMessage(appealRuling.tagDecisionAccept),
      }
    }
    if (ruling === CaseAppealRulingDecision.REPEAL) {
      return {
        color: 'rose',
        text: formatMessage(appealRuling.tagDecisionChange),
      }
    }
    if (ruling === CaseAppealRulingDecision.CHANGED) {
      return {
        color: 'rose',
        text: formatMessage(appealRuling.tagDecisionChange),
      }
    }
    if (ruling === CaseAppealRulingDecision.DISMISSED_FROM_COURT_OF_APPEAL) {
      return {
        color: 'blueberry',
        text: formatMessage(appealRuling.tagDecisionDismissed),
      }
    }
    if (ruling === CaseAppealRulingDecision.DISMISSED_FROM_COURT) {
      return {
        color: 'blueberry',
        text: formatMessage(appealRuling.tagDecisionDismissed),
      }
    }
    if (ruling === CaseAppealRulingDecision.REMAND) {
      return {
        color: 'blueberry',
        text: formatMessage(appealRuling.tagDecisionRemand),
      }
    }
    return undefined
  }

  const tagVariantRuling = getTagVariantForAppealRulingDecision(
    appealRulingDecision,
  )

  if (!tagVariantRuling) return null

  return (
    <Tag variant={tagVariantRuling?.color} outlined disabled>
      {tagVariantRuling.text}
    </Tag>
  )
}

export default TagAppealRuling
