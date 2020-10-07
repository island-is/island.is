import React from 'react'
import { Box, Link } from '@island.is/island-ui/core'
import * as styles from './ServiceDetail.treat'
import cn from 'classnames'
import { ApiService } from '@island.is/api/schema'

export interface ServiceDetailProps {
  service: ApiService
}

export const ServiceDetail = (props: ServiceDetailProps) => {
    return (
        <div>
            <div className={cn(styles.root)}>{props.service}</div>
            <div>Stuffs happening</div>
        </div>
    )
}