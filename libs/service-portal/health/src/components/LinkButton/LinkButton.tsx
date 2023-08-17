import { Button } from '@island.is/island-ui/core'
import { FC } from 'react'

interface Props {
  to: string
  text: Array<string> | string
  skipIcon?: boolean
}

const LinkButton: FC<React.PropsWithChildren<Props>> = ({
  to,
  text,
  skipIcon = false,
}) => (
  <a href={to} target="_blank" rel="noreferrer">
    {skipIcon ? (
      <Button size="small" variant="text">
        {text}
      </Button>
    ) : (
      <Button size="small" variant="text" icon="open" iconType="outline">
        {text}
      </Button>
    )}
  </a>
)

export default LinkButton
