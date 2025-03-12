import React, { useEffect, useState } from 'react'
import YamlParser from 'js-yaml'
import { useQuery } from '@apollo/client'

import { OpenApi } from '@island.is/api-catalogue/types'
import {
  AlertBanner,
  Box,
  LoadingDots,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  GetNamespaceQuery,
  GetOpenApiInput,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { GET_OPEN_API_QUERY } from '@island.is/web/screens/queries'

import { OpenApiDocumentation } from '../OpenApiDocumentation'

export interface OpenApiViewProps {
  strings: GetNamespaceQuery['getNamespace']
  openApiInput: GetOpenApiInput
}

export const OpenApiView = ({ strings, openApiInput }: OpenApiViewProps) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const n = useNamespace(strings)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const [documentation, setDocumentation] = useState<OpenApi>(null)

  const { data, loading, error } = useQuery(GET_OPEN_API_QUERY, {
    variables: {
      input: openApiInput,
    },
  })

  useEffect(() => {
    const onCompleted = (data: { getOpenApi: { spec: string } }) => {
      const converted = YamlParser.load(data.getOpenApi.spec)

      setDocumentation(converted as OpenApi)
    }
    if (onCompleted) {
      if (onCompleted && !loading && !error) {
        onCompleted(data)
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        setDocumentation(null)
      }
    }
  }, [loading, data, error])

  return (
    <Box paddingTop={[3, 3, 4]} paddingBottom={[0, 0, 6]}>
      {loading && (
        <Stack space={3} align="center">
          <LoadingDots />
          <Text variant="h4" color="blue600">
            {n('gettingDocumentation')}
          </Text>
        </Stack>
      )}
      {error && (
        <Box>
          <AlertBanner
            title={n('loadErrorTitle')}
            description={n('loadErrorText')}
            variant="error"
          />
        </Box>
      )}
      {/* Showing Api documentation with redoc */}
      <Box width="full">
        {!loading &&
          !error &&
          (documentation ? (
            <OpenApiDocumentation spec={documentation} />
          ) : (
            // documentation missing
            <AlertBanner
              title={n('queryErrorTitle')}
              description={n('queryErrorText')}
              variant="error"
            />
          ))}
      </Box>
    </Box>
  )
}
