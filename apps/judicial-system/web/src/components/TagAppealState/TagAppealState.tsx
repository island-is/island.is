import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import { Tag, TagVariant } from '@island.is/island-ui/core'
import { tables } from '@island.is/judicial-system-web/messages'
import {
  CaseAppealRulingDecision,
  CaseAppealState,
  InstitutionType,
} from '@island.is/judicial-system-web/src/graphql/schema'

import useStringHelpers from '../../utils/hooks/useStringHelpers/useStringHelpers'
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
  const { user } = useContext(UserContext)
  const { getAppealResultText } = useStringHelpers()

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
      return {
        color:
          ruling === CaseAppealRulingDecision.ACCEPTING
            ? 'mint'
            : ruling === CaseAppealRulingDecision.CHANGED ||
              ruling === CaseAppealRulingDecision.REPEAL
            ? 'rose'
            : 'blueberry',
        text: getAppealResultText(ruling),
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
