import React from 'react'
import { useIntl } from 'react-intl'

import {
  CaseAppealRulingDecision,
  CaseAppealState,
} from '@island.is/judicial-system/types'

import { appealRuling } from '@island.is/judicial-system-web/messages/Core/appealRuling'
import { Tag, TagVariant } from '@island.is/island-ui/core'
import { tables } from '@island.is/judicial-system-web/messages'

interface Props {
  appealState?: CaseAppealState
  appealRulingDecision?: CaseAppealRulingDecision
}

const TagAppealState: React.FC<Props> = ({
  appealRulingDecision,
  appealState,
}) => {
  const { formatMessage } = useIntl()

  const getTagVariantForAppealState = (
    state?: CaseAppealState,
    ruling?: CaseAppealRulingDecision,
  ):
    | {
        color: TagVariant
        text: string
      }
    | undefined => {
    if (state === CaseAppealState.APPEALED) {
      return {
        color: 'red',
        text: formatMessage(tables.appealDate),
      }
    }
    if (state === CaseAppealState.RECEIVED) {
      return {
        color: 'darkerBlue',
        text: formatMessage(tables.receivedTag),
      }
    }
    if (state === CaseAppealState.COMPLETED) {
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
    }
    return undefined
  }

  const tagVariantRuling = getTagVariantForAppealState(
    appealState,
    appealRulingDecision,
  )

  if (!tagVariantRuling) return null

  return (
    <Tag variant={tagVariantRuling?.color} outlined disabled>
      {tagVariantRuling.text}
    </Tag>
  )
}

export default TagAppealState
