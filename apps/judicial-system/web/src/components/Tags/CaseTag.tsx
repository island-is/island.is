import { FC } from 'react'

import { Tag, TagVariant } from '@island.is/island-ui/core'

interface Props {
  color: TagVariant
  text: string
}

const CaseTag: FC<Props> = ({ color, text }) => {
  return (
    <Tag outlined disabled truncate variant={color}>
      {text}
    </Tag>
  )
}

export default CaseTag
