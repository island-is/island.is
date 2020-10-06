import React from 'react'
import { Box, Link } from '@island.is/island-ui/core'
import * as styles from './ServiceCard.treat'
import cn from 'classnames'
import { ServiceStatus, useHorizontalDragScroll } from '..'
import { ApiService } from '@island.is/api/schema'
import {
  AccessCategory,
  PricingCategory,
  DataCategory,
  TypeCategory,
} from '@island.is/api-catalogue/consts'

export interface ServiceCardProps {
  service: ApiService
  cardWidth: number
}

export const ServiceCard = (props: ServiceCardProps) => {
  const dragProps = useHorizontalDragScroll()

  const preventDragHandler = (e) => {
    console.log('preventing')
    e.preventDefault()
  }
  return (
    <div style={{ width: props.cardWidth }} onDragStart={preventDragHandler}>
      <Box borderRadius="large" className={cn(styles.card, 'service-card')}>
        <Link href={`./services/${props.service.id}`}>
          <div className={cn(styles.cardTexts)}>
            <div className={cn(styles.name)}>{props.service.name}</div>
            {/*<ServiceStatus className={styles.serviceStatus} status={props.service.status}/>*/}
            <div className={cn(styles.owner)}>{props.service.owner}</div>
          </div>
        </Link>
        <div {...dragProps} className={cn(styles.scrollBoxWrapper)}>
          <div className={cn(styles.category)}>
            {props.service.pricing?.map((item, index) => (
              <div className={cn(styles.categoryItem, 'no-select')} key={index}>
                {PricingCategory[item]}
              </div>
            ))}
            {props.service.data?.map((item, index) => (
              <div className={cn(styles.categoryItem, 'no-select')} key={index}>
                {DataCategory[item]}
              </div>
            ))}
            {props.service.type?.map((item, index) => (
              <div className={cn(styles.categoryItem, 'no-select')} key={index}>
                {TypeCategory[item]}
              </div>
            ))}
            {props.service.access?.map((item, index) => (
              <div className={cn(styles.categoryItem, 'no-select')} key={index}>
                {AccessCategory[item]}
              </div>
            ))}
          </div>
        </div>
      </Box>
    </div>
  )
}

//export default ServiceCard
