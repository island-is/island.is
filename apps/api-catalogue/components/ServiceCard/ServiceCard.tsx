import React from 'react'
import { Box, Link } from '@island.is/island-ui/core'
import * as styles from './ServiceCard.treat'
import cn from 'classnames'
import { useHorizontalDragScroll } from '..'
import { ApiService } from '@island.is/api/schema'
import {
  AccessCategory,
  PricingCategory,
  DataCategory,
  TypeCategory,
} from '@island.is/api-catalogue/consts'
import { ContentfulString } from '../../services/contentful.types'

export interface ServiceCardProps {
  service: ApiService
  strings: Array<ContentfulString>
}

export const ServiceCard = ({ service, strings }: ServiceCardProps) => {
  const dragProps = useHorizontalDragScroll()

  const preventDragHandler = (e) => {
    e.preventDefault()
  }
  return (
    <div onDragStart={preventDragHandler}>
      <Box borderRadius="large" className={cn(styles.card, 'service-card')}>
        <Link href={`./services/${service.id}`}>
          <div className={cn(styles.cardTexts)}>
            <div className={cn(styles.name)}>{service.name}</div>
            {/*<ServiceStatus className={styles.serviceStatus} status={props.service.status}/>*/}
            <div className={cn(styles.owner)}>{service.owner}</div>
          </div>
        </Link>
        <div {...dragProps} className={cn(styles.scrollBoxWrapper)}>
          <div className={cn(styles.category)}>
            {service.pricing?.map((item, index) => (
              <div
                className={cn(styles.categoryItem, styles.noSelect)}
                key={index}
              >
                {
                  strings.find(
                    (s) =>
                      s.id ===
                      `catalog-filter-pricing-${PricingCategory[
                        item
                      ].toLowerCase()}`,
                  ).text
                }
              </div>
            ))}
            {service.data?.map((item, index) => (
              <div
                className={cn(styles.categoryItem, styles.noSelect)}
                key={index}
              >
                {
                  strings.find(
                    (s) =>
                      s.id ===
                      `catalog-filter-data-${DataCategory[item].toLowerCase()}`,
                  ).text
                }
              </div>
            ))}
            {service.type?.map((item, index) => (
              <div
                className={cn(styles.categoryItem, styles.noSelect)}
                key={index}
              >
                {TypeCategory[item]}
              </div>
            ))}
            {service.access?.map((item, index) => (
              <div
                className={cn(styles.categoryItem, styles.noSelect)}
                key={index}
              >
                {AccessCategory[item]}
              </div>
            ))}
          </div>
        </div>
      </Box>
    </div>
  )
}
