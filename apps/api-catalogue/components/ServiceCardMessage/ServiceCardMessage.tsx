import React from 'react'
import * as styles from './ServiceCardMessage.treat'
import cn from 'classnames'
import { Box } from '@island.is/island-ui/core'

export type ServiceCardMessageTypes = 'default' | 'error'
export type ServiceBorderStyleTypes = 'none'    | 'default'
export type ServiceCardMessageSize  = 'default' | 'growHeight'

export interface ServiceCardMessageProps {
  title: string
  text?: string
  borderStyle?: ServiceBorderStyleTypes
  messageType?: ServiceCardMessageTypes
  size?: ServiceCardMessageSize
}

export const ServiceCardMessage = (props: ServiceCardMessageProps) => {

  return (
    <Box
      borderRadius="large"
      className={cn( {[styles.wrapperNoBorder]: props.borderStyle === 'none'},
                     {[styles.wrapperError]   : props.borderStyle !== 'none' && props.messageType === 'error'},
                     {[styles.wrapper]        : props.borderStyle !== 'none' && props.messageType !== 'error'},
                     {[styles.wrapperFixedSizeSmall] : props.size === undefined || props.size === 'default'},
                     {[styles.wrapperGrowHeight]     : props.size !== undefined && props.size === 'growHeight'},
                )}
    >
      <div className={cn(styles.cardTexts)}>
        <div className={cn(props.messageType !== 'error'? styles.title: styles.titleError)}>{props.title}</div>
        <div className={cn(props.messageType !== 'error'? styles.text: styles.textError)}>{props.text}</div>
      </div>
    </Box>
  )
}

ServiceCardMessage.defaultProps = {
  messageType: 'default',
  borderStyle: 'default',
  size:'default'
}
