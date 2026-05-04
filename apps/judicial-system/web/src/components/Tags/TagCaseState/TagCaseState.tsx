import { FC, useContext } from 'react'
import { useIntl } from 'react-intl'

import { Tag } from '@island.is/island-ui/core'
import { CaseListEntry } from '@island.is/judicial-system-web/src/graphql/schema'

import { UserContext } from '../../UserProvider/UserProvider'
import { mapCaseStateToTagVariant } from './TagCaseState.logic'

interface Props {
  theCase: CaseListEntry
}

const TagCaseState: FC<Props> = (props) => {
  const { formatMessage } = useIntl()
  const { theCase } = props
  const { user } = useContext(UserContext)

  const tagVariant = mapCaseStateToTagVariant(formatMessage, theCase, user)

  if (!tagVariant) return null

  return (
    <Tag variant={tagVariant?.color} outlined disabled truncate>
      {tagVariant.text}
    </Tag>
  )
}

export default TagCaseState
