import React from 'react'
import { Box } from '@island.is/island-ui/core'
import * as styles from './ServiceDetail.treat';
import cn from 'classnames'
import { ServiceCardInformation } from '..';

export interface ServiceDetailProps {
 service:ServiceCardInformation 
}


export const ServiceDetail = (props: ServiceDetailProps) => {
  
  if (props.service === null) {
    return (
        <h2>Not found</h2>
    )
}

  return (
      <Box
        width="full"
        borderRadius="large"
        className={cn(styles.root)}
      >
       <dl>
        <dt>Id</dt><dd>{props.service.id}</dd>
        <dt>Name</dt><dd>{props.service.name}</dd>
        <dt>Owner</dt><dd>{props.service.owner}</dd>
        <dt>Url</dt><dd>{props.service.url}</dd>
        <dt>Status</dt><dd>{props.service.status}</dd>
        <dt>Pricing</dt><dd>{props.service.pricing}</dd>
        <dt>Data</dt><dd>{props.service.data}</dd>
        <dt>Type</dt><dd>{props.service.type}</dd>
        <dt>Access</dt><dd>{props.service.access}</dd>

    </dl>
      </Box>
  )
}

//export default ServiceCard