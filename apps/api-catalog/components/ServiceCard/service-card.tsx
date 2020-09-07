import React from 'react'
import { Box } from '@island.is/island-ui/core'
//import { getQueryParser } from 'next/dist/next-server/server/api-utils';
import styles from './service-card.styles'

//import './service-card.scss'

export interface ServiceCardInformation {
    name: string;
    owner:string;
    pricing:Array<string>;
    categories:Array<string>
    type:Array<string>;
    access:Array<string>;
}

export interface ServiceCardProps {
  service: ServiceCardInformation
}

export const ServiceCard = (props: ServiceCardProps) => {
  return (
    <Box
      boxShadow="large"
      borderRadius="large"
      style={styles.card}
    >
    <div style={styles.serviceStatusContainer}>
      <p style={styles.owner}>{props.service.owner}</p>
      <div className="service-status" style={styles.serviceStatus}></div>
    </div>
    <div style={styles.serviceTexts}>
    <div>
      <div style={styles.name}>{props.service.name}</div>
    </div>
        <div className="prices" style={styles.category} >
          {	props.service.pricing?.map((item, index) => (
                <div style={styles.priceItem} className="card-item" key={index}>{item + ''} </div>
            ))
          }
        </div>
        <div className="categories" style={styles.category} >
          {	props.service.categories?.map((item, index) => (
                <div style={styles.categories} className="card-item" key={index}>{item + ''} </div>
            ))
          }
        </div>
        <div className="type" style={styles.category} >
          {	props.service.type?.map((item, index) => (
                <div style={styles.type} className="card-item" key={index}>{item + ''} </div>
            ))
          }
        </div>
        <div className="access" style={styles.category} >
          {	props.service.access?.map((item, index) => (
                <div style={styles.access} className="card-item" key={index}>{item + ''} </div>
            ))
          }
        </div>
    </div>
</Box>
  )
}

//export default ServiceCard
