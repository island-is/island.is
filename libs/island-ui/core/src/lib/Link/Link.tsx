import * as React from 'react'
import { LinkProps as NextLinkProps } from 'next/link'
import cn from 'classnames'

import { shouldLinkOpenInNewWindow } from '@island.is/shared/utils'

import { useDeprecatedComponent } from '../private/useDeprecatedComponent'
import * as styles from './Link.css'

export type LinkColor = 'white' | 'blue400' | 'blue600'
export type UnderlineVisibility = 'always' | 'hover'
export type UnderlineVariants = 'normal' | 'small'

export interface LinkProps extends NextLinkProps {
  color?: LinkColor
  dataTestId?: string
  className?: string
  underline?: UnderlineVariants
  underlineVisibility?: UnderlineVisibility
  skipTab?: boolean
  onClick?: () => void
  pureChildren?: boolean
  newTab?: boolean
}

// Next link that can handle external urls
export const Link: React.FC<React.PropsWithChildren<LinkProps>> = ({
  children,
  href,
  as,
  replace,
  scroll,
  shallow,
  prefetch,
  color,
  skipTab,
  className,
  underline,
  underlineVisibility = 'hover',
  pureChildren,
  newTab = false,
  dataTestId = undefined,
  ...linkProps
}) => {
  useDeprecatedComponent('Link', 'LinkV2')
  const isInternal = !shouldLinkOpenInNewWindow(href as string)
  const classNames = cn(
    styles.link,
    color ? styles.colors[color] : undefined,
    underline ? styles.underlines[underline] : undefined,
    underline && underlineVisibility
      ? styles.underlineVisibilities[underlineVisibility]
      : undefined,
    className,
    {
      [styles.pointer]: href || linkProps.onClick,
    },
  )

  if (!href) {
    return (
      <span className={classNames} {...linkProps}>
        {children}
      </span>
    )
  }

  if (isInternal) {
    return (
      <a
        className={classNames}
        data-testid={dataTestId}
        href={href as string}
        {...linkProps}
        {...(newTab && { target: '_blank' })}
        tabIndex={skipTab ? -1 : undefined}
      >
        {children}
      </a>
    )
  } else {
    return (
      <a
        href={href as string}
        target="_blank"
        rel="noopener noreferrer"
        className={classNames}
        data-testid={dataTestId}
        {...linkProps}
        tabIndex={skipTab ? -1 : undefined}
      >
        {children}
      </a>
    )
  }
}
