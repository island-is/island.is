import { Button, ButtonProps } from '@island.is/island-ui/core'
import { isExternalLink } from '../../utils/isExternalLink'
import LinkResolver from '../LinkResolver/LinkResolver'
import * as styles from './LinkButton.css'

interface SharedProps {
  to: string
  text: string
  size?: ButtonProps['size']
  disabled?: ButtonProps['disabled']
  skipOutboundTrack?: boolean
}

type Props =
  | {
      variant?: 'primary' | 'ghost' | 'utility'
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
  size,
  to,
  text,
  icon,
  disabled,
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
        {disabled ? (
          <Button
            size={size ?? 'small'}
            unfocusable
            disabled
            icon={isExternal ? 'open' : undefined}
            iconType={isExternal ? 'outline' : undefined}
          >
            {text}
          </Button>
        ) : (
          <Button
            as="span"
            size={size ?? 'small'}
            variant="text"
            unfocusable
            icon={isExternal ? 'open' : undefined}
            iconType={isExternal ? 'outline' : undefined}
          >
            {text}
          </Button>
        )}
      </LinkResolver>
    )
  }
  return (
    <LinkResolver
      skipOutboundTrack={skipOutboundTrack}
      className={styles.link}
      href={to}
    >
      {disabled ? (
        <Button
          colorScheme="default"
          icon={icon}
          iconType="outline"
          size={size ?? 'default'}
          disabled
          variant={variant ?? 'utility'}
          unfocusable
        >
          {text}
        </Button>
      ) : (
        <Button
          colorScheme="default"
          icon={icon}
          iconType="outline"
          size={size ?? 'default'}
          type="text"
          as="span"
          variant={variant ?? 'utility'}
          unfocusable
        >
          {text}
        </Button>
      )}
    </LinkResolver>
  )
}
