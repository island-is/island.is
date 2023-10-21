import * as React from 'react'
import cn from 'classnames'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'

import { shouldLinkOpenInNewWindow } from '@island.is/shared/utils'

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
  pureChildren?: boolean
  newTab?: boolean
  onClick?: () => void
}

// Next link that can handle external urls
export const LinkV2: React.FC<React.PropsWithChildren<LinkProps>> = ({
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
  onClick,
  ...linkProps
}) => {
  const isInternal = !shouldLinkOpenInNewWindow(href as string)
  const classNames = cn(
    styles.link,
    color ? styles.colors[color] : undefined,
    underline ? styles.underlines[underline] : undefined,
    underline && underlineVisibility
      ? styles.underlineVisibilities[underlineVisibility]
      : undefined,
    className,
  )

  if (isInternal) {
    return (
      <NextLink
        href={href}
        as={as}
        shallow={shallow}
        scroll={scroll}
        passHref
        prefetch={prefetch}
        data-testid={dataTestId}
        legacyBehavior
      >
        {pureChildren ? (
          children
        ) : (
          <a
            className={classNames}
            data-testid={dataTestId}
            {...linkProps}
            {...(newTab && { target: '_blank' })}
            tabIndex={skipTab ? -1 : undefined}
          >
            {children}
          </a>
        )}
      </NextLink>
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
