import React from 'react'
import { Box, Link, Stack } from '@island.is/island-ui/core'
import * as styles from './ServiceCard.treat'
import cn from 'classnames'
import { useHorizontalDragScroll } from '..'
import { ApiService } from '@island.is/api/schema'
import { useIsomorphicLayoutEffect, useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
import { capitalize } from '../../utils'

import { GetNamespaceQuery } from '../../types'
import { useNamespace } from '../../hooks'

export interface ServiceCardProps {
  service: ApiService
  strings: GetNamespaceQuery['getNamespace']
}

export const ServiceCard = ({ service, strings }: ServiceCardProps) => {
  const n = useNamespace(strings)
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
                    {n(`pricing${capitalize(item)}`)}
                  </Box>
                ))}
                {service.data?.map((item, index) => (
                  <Box
                    className={cn(styles.categoryItem, styles.noSelect)}
                    key={index}
                  >
                    {n(`data${capitalize(item)}`)}
                  </Box>
                ))}
                {service.type?.map((item, index) => (
                  <Box
                    className={cn(styles.categoryItem, styles.noSelect)}
                    key={index}
                  >
                    {n(`type${capitalize(item)}`)}
                  </Box>
                ))}
                {service.access?.map((item, index) => (
                  <Box
                    className={cn(styles.categoryItem, styles.noSelect)}
                    key={index}
                  >
                    {n(`access${capitalize(item)}`)}
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
