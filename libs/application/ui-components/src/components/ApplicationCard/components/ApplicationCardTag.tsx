import { Tag } from '@island.is/island-ui/core'
import { ApplicationCardProps } from '../ApplicationCard'

interface Props {
  tag?: ApplicationCardProps['tag']
}

export const ApplicationCardTag = ({ tag }: Props) => {
  if (!tag || !tag.label) {
    return null
  }

  return (
    <Tag outlined={tag.outlined} variant={tag.variant} disabled>
      {tag.label}
    </Tag>
  )
}
