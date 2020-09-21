import React from 'react'
import { Box, Link } from '@island.is/island-ui/core'
import * as styles from './ServiceCard.treat';
import cn from 'classnames'
import { ServiceStatus } from '..';

import type { ServiceCardInformation } from '..';

export interface ServiceCardProps {
  service: ServiceCardInformation
}

export const ServiceCard = (props: ServiceCardProps) => {
  
  return (
    <Link href={`./services/${props.service.id}`}>
      <Box
        borderRadius="large"
        className={cn(styles.card, "service-card")}
      >
        <div className={cn(styles.cardTexts)}>
          
          <div className={cn(styles.name)}>{props.service.name}</div>
          <ServiceStatus className={styles.serviceStatus} status={props.service.status}/>
          <div className={cn(styles.owner)}>{props.service.owner}</div>
        </div>
        <div className={cn(styles.category)}>
          {	props.service.pricing?.map((item, index) => (
                <div className={cn(styles.sharedStyles,"card-item pricing")} key={index}>{item + ''} </div>
            ))
          }
          {	props.service.data?.map((item, index) => (
                <div className={cn(styles.sharedStyles,"card-item data")} key={index}>{item + ''} </div>
            ))
          }
          {	props.service.type?.map((item, index) => (
                <div className={cn(styles.sharedStyles,"card-item type")} key={index}>{item + ''} </div>
            ))
          }
          {	props.service.access?.map((item, index) => (
                <div className={cn(styles.sharedStyles,"card-item access")} key={index}>{item + ''} </div>
            ))
          }
      </div>
      </Box>
    </Link>
  )
}

//export default ServiceCard