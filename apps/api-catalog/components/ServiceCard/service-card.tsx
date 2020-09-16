import React from 'react'
import { Box } from '@island.is/island-ui/core'
import * as styles from './service-card.treat';
import cn from 'classnames'
import { ServiceStatus, SERVICE_STATUS } from '..';

export interface ServiceCardInformation {
    id:number
    name: string;
    owner:string;
    url:string;
    pricing:Array<string>;
    data:Array<string>
    type:Array<string>;
    access:Array<string>;
    status:SERVICE_STATUS;
}

export interface ServiceCardProps {
  service: ServiceCardInformation
}

export const ServiceCard = (props: ServiceCardProps) => {

  return (
    <Box
      width="full"
      boxShadow="large"
      borderRadius="large"
      className={cn(styles.card, "service-card")}
    >
        <div  className={cn(styles.cardTexts)}>
          <ServiceStatus paddingTop={20} bulletSpacing="medium" status={props.service.status}/>
          <div className={cn(styles.name)}>{props.service.name}</div>
          <div className={cn(styles.owner)}>{props.service.owner}</div>
        </div>
        <div className={cn(styles.categoryContainer)}>
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
      </div>
</Box>
  )
}

//export default ServiceCard
