import React, { FC } from 'react'
import { OpenApi } from '@island.is/api-catalogue/types'
import { Text, Box, Tooltip } from '@island.is/island-ui/core'
import RedocStandalone from './RedocStandalone'

export interface OpenApiDocumentationProps {
  spec: OpenApi
  liveSpecification: boolean
}

export const OpenApiDocumentation: FC<OpenApiDocumentationProps> = ({
  spec,
  liveSpecification,
}: OpenApiDocumentationProps) => {
  return (
    <Box width="full" background="white">
      {liveSpecification && (
        <Box display="flex" width="full" justifyContent="flexEnd">
          <Text>
            Live{' '}
            <Tooltip
              placement="right"
              as="button"
              text={'The specification was fetched when this page was opened.'}
            />
          </Text>
        </Box>
      )}
      <RedocStandalone
        spec={spec}
        options={{
          noAutoAuth: true,
          showExtensions: true,
        }}
      />
    </Box>
  )
}
