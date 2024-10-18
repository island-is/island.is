import React from 'react'

import { OpenApi } from '@island.is/api-catalogue/types'
import { Box } from '@island.is/island-ui/core'

import RedocStandalone from './RedocStandalone'

export interface OpenApiDocumentationProps {
  spec: OpenApi
}

export const OpenApiDocumentation = ({ spec }: OpenApiDocumentationProps) => {
  return (
    // Use transform that has no effect(similar to null) to keep Redocly watermark inside element
    <Box width="full" background="white" style={{ transform: 'scale(1)' }}>
      <RedocStandalone
        spec={spec}
        options={{
          showExtensions: true,
          hideHostname: true,
        }}
      />
    </Box>
  )
}
