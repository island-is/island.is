import { Button } from '@island.is/island-ui/core'
import { useLocation } from 'react-router-dom'
import { FC } from 'react'
import { servicePortalOutboundLink } from '@island.is/plausible'
import { formatPlausiblePathToParams } from '../../utils/formatPlausiblePathToParams'

interface Props {
  to: string
  text: Array<string> | string
  skipIcon?: boolean
}

export const LinkButton: FC<React.PropsWithChildren<Props>> = ({
  to,
  text,
  skipIcon = false,
}) => {
  const { pathname } = useLocation()
  return (
    <a
      href={to}
      onClick={() =>
        servicePortalOutboundLink({
          url: formatPlausiblePathToParams(pathname).url,
          outboundUrl: to,
        })
      }
      target="_blank"
      rel="noreferrer"
    >
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
}
