import { FC, useContext } from 'react'
import { useIntl } from 'react-intl'

import { Tag, TagVariant } from '@island.is/island-ui/core'
import { getAppealResultTextByValue } from '@island.is/judicial-system/formatters'
import { tables } from '@island.is/judicial-system-web/messages'
import {
  AppealCaseState,
  CaseAppealRulingDecision,
  InstitutionType,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { UserContext } from '../../UserProvider/UserProvider'

interface Props {
  appealState?: AppealCaseState | null
  appealRulingDecision?: CaseAppealRulingDecision | null
  appealCaseNumber?: string | null
}

const TagAppealState: FC<Props> = ({
  appealRulingDecision,
  appealState,
  appealCaseNumber,
}) => {
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)

  const getTagVariantForAppealState = (
    state?: AppealCaseState | null,
    ruling?: CaseAppealRulingDecision | null,
  ):
    | {
        color: TagVariant
        text: string
      }
    | undefined => {
    if (state === AppealCaseState.WITHDRAWN) {
      return {
        color: 'red',
        text: formatMessage(tables.withdrawnTag),
      }
    }
    if (state === AppealCaseState.APPEALED) {
      return {
        color: 'red',
        text: formatMessage(tables.appealDate),
      }
    }
    if (state === AppealCaseState.RECEIVED) {
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
    if (state === AppealCaseState.COMPLETED) {
      return {
        color:
          ruling === CaseAppealRulingDecision.ACCEPTING
            ? 'mint'
            : ruling === CaseAppealRulingDecision.CHANGED ||
              ruling === CaseAppealRulingDecision.CHANGED_SIGNIFICANTLY ||
              ruling === CaseAppealRulingDecision.REPEAL ||
              ruling === CaseAppealRulingDecision.DISCONTINUED
            ? 'rose'
            : 'blueberry',
        text: getAppealResultTextByValue(ruling),
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
