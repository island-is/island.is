import React from 'react'

import './service-portal-documents.scss'
import { Typography, Box } from '@island.is/island-ui/core'

/* eslint-disable-next-line */
export interface ServicePortalDocumentsProps {}

export const ServicePortalDocuments = (props: ServicePortalDocumentsProps) => {
  return (
    <Box padding={4}>
      <Typography variant="h3" as="h3">
        Rafræn skjöl
      </Typography>
      <Box border="standard" padding={2} marginTop={1}>
        <Typography variant="h3" as="h3">
          Greiðsluseðill (Bifr.gjöld) - Ríkissjóðsinnheimtur
        </Typography>
      </Box>
    </Box>
  )
}

export default ServicePortalDocuments
