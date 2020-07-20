import React, { FC } from 'react'
import cn from 'classnames'
import { ContentBlock, Box, BoxProps } from '@island.is/island-ui/core'
import * as styles from './Layout.treat'

export interface LayoutProps {
  background?: BackgroundProps['type']
  contentProps?: ContentProps
  boxProps?: BoxProps
}

const Layout: FC<LayoutProps> = ({
  background,
  contentProps,
  boxProps,
  children,
}) => {
  if (boxProps) {
    children = <Box {...boxProps}>{children}</Box>
  }

  if (contentProps) {
    children = <Content {...contentProps}>{children}</Content>
  }

  return (
    /* Pick how to render background */
    <Background type={background}>
      {/* Center on page */}
      <ContentBlock>
        {/* Padding around whole page content on desktop */}
        <Box paddingX={[0, 0, 0, 6]}>{children}</Box>
      </ContentBlock>
    </Background>
  )
}

export interface ContentProps {
  columns?: 6 | 7 | 8
  offsetRight?: boolean
  center?: boolean
}

export const Content: FC<ContentProps> = ({
  columns,
  offsetRight = true,
  center = false,
  children,
}) => (
  <div className={cn(styles.content, { [styles.offsetRight]: offsetRight })}>
    <div
      className={cn({
        [styles.center]: center,
        [styles.col6]: columns === 6,
        [styles.col7]: columns === 7,
        [styles.col8]: columns === 8,
      })}
    >
      {children}
    </div>
  </div>
)

export interface BackgroundProps {
  type: 'gradient' | BoxProps['type']
}

export const Background: FC<BackgroundProps> = ({ type, children }) => {
  if (type === 'gradient') {
    return <div className={styles.backgroundGradient}>{children}</div>
  }

  return <Box background={type}>{children}</Box>
}

export default Layout
