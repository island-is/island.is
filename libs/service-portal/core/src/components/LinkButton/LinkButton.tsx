import { Button, ButtonProps } from '@island.is/island-ui/core'
import { FC } from 'react'
import { isExternalLink } from '../../utils/isExternalLink'
import LinkResolver from '../LinkResolver/LinkResolver'
import * as styles from './LinkButton.css'

interface Props {
  to: string
  text: string
  icon?: ButtonProps['icon']
  skipOutboundTrack?: boolean
  /**
   * default variant is "text"
   */
  variant?: 'button' | 'text'
}

export const LinkButton: FC<React.PropsWithChildren<Props>> = ({
  variant = 'text',
  to,
  text,
  icon,
  skipOutboundTrack,
}) => {
  const isExternal = isExternalLink(to)
  if (variant === 'text') {
    return (
      <LinkResolver
        className={styles.link}
        skipOutboundTrack={skipOutboundTrack}
        href={to}
      >
        <Button
          as="span"
          size="small"
          variant="text"
          unfocusable
          icon={isExternal ? 'open' : undefined}
          iconType={isExternal ? 'outline' : undefined}
        >
          {text}
        </Button>
      </LinkResolver>
    )
  }
  return (
    <LinkResolver
      skipOutboundTrack={skipOutboundTrack}
      className={styles.link}
      href={to}
    >
      <Button
        colorScheme="default"
        icon={icon}
        iconType="outline"
        size="default"
        type="text"
        as="span"
        variant="utility"
        unfocusable
      >
        {text}
      </Button>
    </LinkResolver>
  )
}
