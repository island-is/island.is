import React from 'react'
import { Box, Link, Stack } from '@island.is/island-ui/core'
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
import { useIsomorphicLayoutEffect, useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'

export interface ServiceCardProps {
  service: ApiService
  strings: Array<ContentfulString>
}

export const ServiceCard = ({ service, strings }: ServiceCardProps) => {
  const dragProps = useHorizontalDragScroll()

  const preventDragHandler = (e) => {
    e.preventDefault()
  }

  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = React.useState(false)

  useIsomorphicLayoutEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  return (
    <Box onDragStart={preventDragHandler}>
      <Box
        borderRadius="large"
        className={cn(isMobile ? styles.cardMobile : styles.card)}
      >
        <Link href={`./services/${service.id}`}>
          <Stack space={3}>
            <Box className={cn(styles.cardTexts)}>
              <Stack space={1}>
                <h1 className={cn(isMobile ? styles.nameMobile : styles.name)}>
                  {service.name}
                </h1>
                <p className={cn(isMobile ? styles.ownerMobile : styles.owner)}>
                  {service.owner}
                </p>
              </Stack>
            </Box>
            <Box {...dragProps} className={cn(styles.scrollBoxWrapper)}>
              <Box className={cn(styles.category)}>
                {service.pricing?.map((item, index) => (
                  <Box
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
                  </Box>
                ))}
                {service.data?.map((item, index) => (
                  <Box
                    className={cn(styles.categoryItem, styles.noSelect)}
                    key={index}
                  >
                    {
                      strings.find(
                        (s) =>
                          s.id ===
                          `catalog-filter-data-${DataCategory[
                            item
                          ].toLowerCase()}`,
                      ).text
                    }
                  </Box>
                ))}
                {service.type?.map((item, index) => (
                  <Box
                    className={cn(styles.categoryItem, styles.noSelect)}
                    key={index}
                  >
                    {TypeCategory[item]}
                  </Box>
                ))}
                {service.access?.map((item, index) => (
                  <Box
                    className={cn(styles.categoryItem, styles.noSelect)}
                    key={index}
                  >
                    {AccessCategory[item]}
                  </Box>
                ))}
              </Box>
            </Box>
          </Stack>
        </Link>
      </Box>
    </Box>
  )
}
