import React from 'react'
import { OpenApi } from '@island.is/api-catalogue/types'
import { Box } from '@island.is/island-ui/core'
import RedocStandalone from './RedocStandalone'

export interface OpenApiDocumentationProps {
  spec: OpenApi
}

export const OpenApiDocumentation = ({ spec }: OpenApiDocumentationProps) => {
  return (
    <Box width="full" background="white">
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
