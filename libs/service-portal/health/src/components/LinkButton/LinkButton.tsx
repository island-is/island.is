import { Button } from '@island.is/island-ui/core'
import { FC } from 'react'

interface Props {
  to: string
  text: string
}

const LinkButton: FC<Props> = ({ to, text }) => (
  <a href={to} target="_blank" rel="noreferrer">
    <Button size="small" variant="text" icon="open" iconType="outline">
      {text}
    </Button>
  </a>
)

export default LinkButton
