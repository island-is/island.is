import { Tag } from '@island.is/island-ui/core'

export const ApplicationCardTag = () => {
  const label = 'test label'
  const variant = 'blue'

  return (
    <Tag outlined={false} variant={variant} disabled>
      {label}
    </Tag>
  )
}
