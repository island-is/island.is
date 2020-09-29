import React from 'react'
import * as styles from './ServiceCardMessage.treat'
import cn from 'classnames'
import { Box } from '@island.is/island-ui/core';

type ServiceCardMessageTypes = 'default' | 'error'
type borderStyleTypes = "none" | "standard"

export interface ServiceCardMessageProps {
  title: string
  text?: string
  borderStyle: borderStyleTypes
  messageType?: ServiceCardMessageTypes
}

export const ServiceCardMessage = (props: ServiceCardMessageProps) => {


  if (props.messageType === 'error') {
    return (
      <Box
        borderRadius='large'

        className={cn(props.borderStyle === "none" ? styles.wrapperNoBorder : styles.wrapperError)}
      >
        <div className={cn(styles.cardTexts)}>
          <div className={cn(styles.titleError)}>{props.title}</div>
          <div className={cn(styles.textError)}>{props.text}</div>
        </div>
      </Box>)
  }

  // default
  return (
    <Box
      borderRadius='large'
      className={cn(props.borderStyle === "none" ? styles.wrapperNoBorder : styles.wrapper)}
    >
      <div className={cn(styles.cardTexts)}>
        <div className={cn(styles.title)}>{props.title}</div>
        <div className={cn(styles.text)}>{props.text}</div>

      </div>
    </Box>
  )

}

ServiceCardMessage.defaultProps = {
  messageType: 'default',
  borderStyle: 'standard'
}