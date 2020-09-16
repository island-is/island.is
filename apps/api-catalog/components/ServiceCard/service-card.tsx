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
      <ServiceStatus paddingTop={20} bulletSpacing="medium" status={props.service.status}/>
      <div className={cn(styles.name)}>{props.service.name}</div>
      <div className={cn(styles.owner)}>{props.service.owner}</div>
      <div className={cn(styles.categoryLabel)}>
        <div className={cn(styles.category, "prices")}>
          {	props.service.pricing?.map((item, index) => (
                <div className={cn(styles.priceItem,"card-item")} key={index}>{item + ''} </div>
            ))
          }
        </div>
        <div className={cn(styles.category, "categories")} >
          {	props.service.data?.map((item, index) => (
                <div className={cn(styles.categories,"card-item")} key={index}>{item + ''} </div>
            ))
          }
        </div>
        <div className={cn(styles.category, "type")} >
          {	props.service.type?.map((item, index) => (
                <div className={cn(styles.type,"card-item")} key={index}>{item + ''} </div>
            ))
          }
        </div>
        <div className={cn(styles.category,"access")} >
          {	props.service.access?.map((item, index) => (
                <div className={cn(styles.access,"card-item")} key={index}>{item + ''} </div>
            ))
          }
        </div>
      </div>
</Box>
  )
}

//export default ServiceCard
