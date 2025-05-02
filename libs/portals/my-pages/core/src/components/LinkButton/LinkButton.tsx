import { Button, ButtonProps, ButtonTypes } from '@island.is/island-ui/core'
import { isExternalLink } from '../../utils/isExternalLink'
import LinkResolver from '../LinkResolver/LinkResolver'
import * as styles from './LinkButton.css'

interface Props {
  to: string
  text: string
  icon?: ButtonProps['icon']
  size?: ButtonProps['size']
  disabled?: ButtonProps['disabled']
  skipOutboundTrack?: boolean
}

type LinkButtonProps = Props & ButtonTypes

export const LinkButton = (props: LinkButtonProps) => {
  const { size, to, text, icon, disabled, skipOutboundTrack, ...rest } = props
  const isExternal = isExternalLink(to)

  if (rest.variant === 'text') {
    return disabled ? (
      <Button
        size={size ?? 'small'}
        unfocusable
        disabled
        icon={isExternal ? 'open' : undefined}
        iconType={isExternal ? 'outline' : undefined}
        {...rest}
      >
        {text}
      </Button>
    ) : (
      <LinkResolver
        className={styles.link}
        skipOutboundTrack={skipOutboundTrack}
        href={to}
      >
        <Button
          as="span"
          size={size ?? 'small'}
          variant="text"
          unfocusable
          icon={isExternal ? 'open' : icon ?? undefined}
          iconType={isExternal ? 'outline' : undefined}
          {...rest}
        >
          {text}
        </Button>
      </LinkResolver>
    )
  }
  return disabled ? (
    <Button
      icon={icon}
      iconType="outline"
      size={size ?? 'default'}
      disabled
      unfocusable
      {...rest}
    >
      {text}
    </Button>
  ) : (
    <LinkResolver
      skipOutboundTrack={skipOutboundTrack}
      className={styles.link}
      href={to}
    >
      <Button
        icon={icon}
        iconType="outline"
        size={size ?? 'default'}
        type="text"
        as="span"
        unfocusable
        {...rest}
      >
        {text}
      </Button>
    </LinkResolver>
  )
}
