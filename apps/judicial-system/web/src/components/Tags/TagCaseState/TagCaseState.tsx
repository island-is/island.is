import { FC, useContext } from 'react'
import { IntlShape, useIntl } from 'react-intl'

import { Tag } from '@island.is/island-ui/core'
import { CaseListEntry } from '@island.is/judicial-system-web/src/graphql/schema'

import { UserContext } from '../../UserProvider/UserProvider'
import { CaseStateTag, mapCaseStateToTagVariant } from './TagCaseState.logic'

interface Props {
  theCase: CaseListEntry
  customMapCaseStateToTag?: (
    formatMessage: IntlShape['formatMessage'],
    theCase: CaseListEntry,
  ) => CaseStateTag
}

const TagCaseState: FC<Props> = (props) => {
  const { formatMessage } = useIntl()
  const { theCase, customMapCaseStateToTag } = props
  const { user } = useContext(UserContext)

  const tagVariant = customMapCaseStateToTag
    ? customMapCaseStateToTag(formatMessage, theCase)
    : mapCaseStateToTagVariant(formatMessage, theCase, user)

  if (!tagVariant) return null

  return (
    <Tag variant={tagVariant?.color} outlined disabled truncate>
      {tagVariant.text}
    </Tag>
  )
}

export default TagCaseState
