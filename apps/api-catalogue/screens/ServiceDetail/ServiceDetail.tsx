import React from 'react'
import { Layout, ServiceDetail as ServiceDetails } from '../../components'
import { ApiService } from '@island.is/api/schema'
import { GridContainer } from '@island.is/island-ui/core'
import { Page } from '../../services/contentful.types'
import * as styles from './ServiceDetail.treat'
import cn from 'classnames'

export interface ServiceDetailProps {
  service: ApiService
  filterStrings: Page
}

export function ServiceDetail({ service, filterStrings }: ServiceDetailProps) {
  return (
    <GridContainer>
      {service?.name == null ? (
        <div className={cn(styles.errorContainer)}>Þjónusta fannst ekki</div>
      ) : (
        <ServiceDetails service={service} strings={filterStrings.strings} />
      )}
    </GridContainer>
  )
}
