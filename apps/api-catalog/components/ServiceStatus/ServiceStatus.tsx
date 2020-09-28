import React, { FC } from 'react'
import { Icon } from '@island.is/island-ui/core'
import { Colors } from '@island.is/island-ui/theme'

export enum SERVICE_STATUS {
    UNKNOWN,
    OK,
    WARNING,
    ERROR
}


export interface ServiceStatusProps {
    className?: string;
    status: SERVICE_STATUS
  }



export const ServiceStatus:FC<ServiceStatusProps> = ({className, status}) => {
    
    const getColor = (status):Colors => {
        switch(status) {
            case SERVICE_STATUS.OK      : return 'mint600';
            case SERVICE_STATUS.WARNING : return 'yellow600';
            case SERVICE_STATUS.ERROR   : return 'red400';
        }
      
        return 'transparent';
    }

    return (
            <span className={className}>
            <Icon  type="bullet" color={getColor(status)} />
            </span>
    )
}