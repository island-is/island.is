import { Button, ButtonProps } from '@island.is/island-ui/core'
import { isExternalLink } from '../../utils/isExternalLink'
import LinkResolver from '../LinkResolver/LinkResolver'
import * as styles from './LinkButton.css'

interface SharedProps {
  to: string
  text: string
  skipOutboundTrack?: boolean
}

type Props =
  | {
      variant?: 'button'
      icon?: ButtonProps['icon']
    }
  | {
      /**
       * default variant is "text"
       */
      variant?: 'text'
      icon?: never
    }

type LinkButtonProps = SharedProps & Props

export const LinkButton = ({
  variant = 'text',
  to,
  text,
  icon,
  skipOutboundTrack,
}: LinkButtonProps) => {
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
