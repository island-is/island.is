import React from 'react'
import * as styles from './ServiceCardMessage.treat'
import cn from 'classnames'
import { Box } from '@island.is/island-ui/core'
import { useIsomorphicLayoutEffect, useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'

export type ServiceCardMessageTypes = 'default' | 'error'
export type ServiceBorderStyleTypes = 'none' | 'default'
export type ServiceCardMessageSize = 'default' | 'growHeight'

export interface ServiceCardMessageProps {
  title: string
  text?: string
  borderStyle?: ServiceBorderStyleTypes
  messageType?: ServiceCardMessageTypes
  size?: ServiceCardMessageSize
}

export const ServiceCardMessage = (props: ServiceCardMessageProps) => {
  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = React.useState(false)

  useIsomorphicLayoutEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  return (
    <Box
      borderRadius="large"
      className={cn(
        { [styles.wrapperNoBorder]: props.borderStyle === 'none' },
        {
          [styles.wrapperError]:
            props.borderStyle !== 'none' && props.messageType === 'error',
        },
        {
          [styles.wrapper]:
            props.borderStyle !== 'none' && props.messageType !== 'error',
        },
        {
          [isMobile
            ? styles.wrapperFixedSizeMobile
            : styles.wrapperFixedSizeDesktop]:
            props.size === undefined || props.size === 'default',
        },
        {
          [isMobile
            ? styles.wrapperGrowHeightMobile
            : styles.wrapperGrowHeightDesktop]:
            props.size !== undefined && props.size === 'growHeight',
        },
      )}
    >
      <div className={cn(styles.cardTexts)}>
        <div
          className={cn(
            props.messageType !== 'error'
              ? isMobile
                ? styles.titleMobile
                : styles.title
              : isMobile
              ? styles.titleErrorMobile
              : styles.titleErrorDesktop,
          )}
        >
          {props.title}
        </div>
        <div
          className={cn(
            props.messageType !== 'error'
              ? isMobile
                ? styles.textMobile
                : styles.text
              : isMobile
              ? styles.textErrorMobile
              : styles.textErrorDesktop,
          )}
        >
          {props.text}
        </div>
      </div>
    </Box>
  )
}

ServiceCardMessage.defaultProps = {
  messageType: 'default',
  borderStyle: 'default',
  size: 'default',
}
