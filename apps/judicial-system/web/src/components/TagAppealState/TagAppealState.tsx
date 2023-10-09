import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import { Tag, TagVariant } from '@island.is/island-ui/core'
import { Feature } from '@island.is/judicial-system/types'
import { tables } from '@island.is/judicial-system-web/messages'
import { appealRuling } from '@island.is/judicial-system-web/messages/Core/appealRuling'
import {
  CaseAppealRulingDecision,
  CaseAppealState,
  InstitutionType,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { FeatureContext } from '../FeatureProvider/FeatureProvider'
import { UserContext } from '../UserProvider/UserProvider'

interface Props {
  appealState?: CaseAppealState | null
  appealRulingDecision?: CaseAppealRulingDecision | null
  appealCaseNumber?: string | null
}

const TagAppealState: React.FC<React.PropsWithChildren<Props>> = ({
  appealRulingDecision,
  appealState,
  appealCaseNumber,
}) => {
  const { formatMessage } = useIntl()
  const { features } = useContext(FeatureContext)
  const { user } = useContext(UserContext)

  if (!features.includes(Feature.APPEAL_TO_COURT_OF_APPEALS)) {
    return null
  }

  const getTagVariantForAppealState = (
    state?: CaseAppealState | null,
    ruling?: CaseAppealRulingDecision | null,
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
      if (
        user?.institution?.type === InstitutionType.COURT_OF_APPEALS &&
        !appealCaseNumber
      ) {
        return {
          color: 'purple',
          text: formatMessage(tables.newTag),
        }
      } else
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
    <Tag variant={tagVariantRuling?.color} outlined disabled truncate>
      {tagVariantRuling.text}
    </Tag>
  )
}

export default TagAppealState
