import React, { FC } from 'react'
import { Icon } from '@island.is/island-ui/core'
import { Colors } from '@island.is/island-ui/theme'
import * as styles from './ServiceStatus.treat';
import cn from 'classnames'

export enum SERVICE_STATUS {
    UNKNOWN,
    OK,
    WARNING,
    ERROR
}


export interface ServiceStatusProps {
    bulletSpacing?: 'small' | 'medium' | 'large'
    paddingTop?: string | number
    status: SERVICE_STATUS
  }



export const ServiceStatus:FC<ServiceStatusProps> = ({bulletSpacing="medium", paddingTop, status}) => {
    
    const getText = (status:SERVICE_STATUS):string => {
      switch(status) {
          case SERVICE_STATUS.OK      : return "OK";
          case SERVICE_STATUS.WARNING : return "Warning";
          case SERVICE_STATUS.ERROR   : return "Error";
      }
    
      return "Unknown";
    }
    const getColor = (status):Colors => {
        switch(status) {
            case SERVICE_STATUS.OK      : return 'mint600';
            case SERVICE_STATUS.WARNING : return 'yellow600';
            case SERVICE_STATUS.ERROR   : return 'red600';
        }
      
        return 'dark300';
    }

    return (
        <div className={cn(styles.root)} style={{ paddingTop }}>
            <span
                className={cn(styles.bullet)}
                style={{ paddingTop }}
            >
                <Icon type="bullet" color={getColor(status)} />
            </span>
            <span className={cn({
            [styles.spacingSmall]:  bulletSpacing === 'small',
            [styles.spacingMedium]: bulletSpacing === 'medium',
            [styles.spacingLarge]:  bulletSpacing === 'large',
        })}>{getText(status)}</span>
        </div>

    )
}