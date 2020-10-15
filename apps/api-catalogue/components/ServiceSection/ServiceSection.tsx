import React from 'react'
import { Box } from '@island.is/island-ui/core'
import * as styles from './ServiceSection.treat'
import cn from 'classnames'
import { ServiceDetails } from '..'

export interface ServiceSectionProps {
  service: ServiceDetails
}

export const ServiceSection = (props: ServiceSectionProps) => {
  if (props.service === null) {
    return <h2>Not found</h2>
  }

  return (
    <Box width="full" borderRadius="large" className={cn(styles.root)}>
      <dl>
        <dt>Id</dt>
        <dd>{props.service.id}</dd>
        <dt>Name</dt>
        <dd>{props.service.name}</dd>
        <dt>Description</dt>
        <dd>{props.service.description}</dd>
        <dt>Owner</dt>
        <dd>{props.service.owner}</dd>
        <dt>Url</dt>
        <dd>{props.service.url}</dd>
        <dt>Status</dt>
        <dd>{props.service.status}</dd>
        <dt>Pricing</dt>
        <dd>{props.service.pricing}</dd>
        <dt>Data</dt>
        <dd>{props.service.data}</dd>
        <dt>Type</dt>
        <dd>{props.service.type}</dd>
        <dt>Access</dt>
        <dd>{props.service.access}</dd>
      </dl>
    </Box>
  )
}
