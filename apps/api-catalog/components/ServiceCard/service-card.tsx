import React from 'react'
import { Box } from '@island.is/island-ui/core'
import * as stylesNew from './service-card.treat';
import cn from 'classnames'

export interface ServiceCardInformation {
    id:number
    name: string;
    owner:string;
    url:string;
    pricing:Array<string>;
    data:Array<string>
    type:Array<string>;
    access:Array<string>;
    status:ServiceStatusValue;
}

export enum ServiceStatusValue {
  UNKNOWN,
  OK,
  WARNING,
  ERROR
}

export interface ServiceCardProps {
  service: ServiceCardInformation
}

function getServiceStatusClass(serviceCardInformation?:ServiceStatusValue): string{

  switch(serviceCardInformation) {
    case ServiceStatusValue.ERROR  : return "error";
    case ServiceStatusValue.OK     : return "ok";
    case ServiceStatusValue.WARNING: return "warning";

  }

  return "silver";

}
export const ServiceCard = (props: ServiceCardProps) => {

  return (
    <Box
      boxShadow="large"
      borderRadius="large"
      className={cn(stylesNew.card, "service-card")}
    >
    <div  className={cn(stylesNew.serviceStatusContainer)}>
      <div className={cn(stylesNew.name)}>{props.service.name}</div>
      <div 
        className={cn(stylesNew.serviceStatus,"service-status ", getServiceStatusClass(props.service.status))}></div>
    </div>
    <div className={cn(stylesNew.serviceTexts)}>
    <div>
      <div className={cn(stylesNew.owner)}>{props.service.owner}</div>
    </div>
        <div className={cn(stylesNew.category, "prices")}>
          {	props.service.pricing?.map((item, index) => (
                <div className={cn(stylesNew.priceItem,"card-item")} key={index}>{item + ''} </div>
            ))
          }
        </div>
        <div className={cn(stylesNew.category, "categories")} >
          {	props.service.data?.map((item, index) => (
                <div className={cn(stylesNew.categories,"card-item")} key={index}>{item + ''} </div>
            ))
          }
        </div>
        <div className={cn(stylesNew.category, "type")} >
          {	props.service.type?.map((item, index) => (
                <div className={cn(stylesNew.type,"card-item")} key={index}>{item + ''} </div>
            ))
          }
        </div>
        <div className={cn(stylesNew.category,"access")} >
          {	props.service.access?.map((item, index) => (
                <div className={cn(stylesNew.access,"card-item")} key={index}>{item + ''} </div>
            ))
          }
        </div>
    </div>
</Box>
  )
}

//export default ServiceCard
