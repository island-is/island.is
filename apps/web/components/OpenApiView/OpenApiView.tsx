import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import {
  AlertBanner,
  Box,
  Text,
  LoadingIcon,
  Stack,
} from '@island.is/island-ui/core'
import {
  GetOpenApiInput,
  GetNamespaceQuery,
  GetOpenApiQueryVariables,
  GetOpenApiQuery,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { OpenApi } from '@island.is/api-catalogue/types'
import { GET_OPEN_API_QUERY } from '@island.is/web/screens/queries'
import YamlParser from 'js-yaml'
import { OpenApiDocumentation } from '../OpenApiDocumentation'
import { Namespace } from 'libs/api/mocks/src/types'

export interface OpenApiViewProps {
  strings: GetNamespaceQuery['getNamespace']
  openApiInput: GetOpenApiInput
}

export const OpenApiView = ({ strings, openApiInput }: OpenApiViewProps) => {
  const n = useNamespace(strings as Namespace)

  const [documentation, setDocumentation] = useState<OpenApi | null>(null)

  const { data, loading, error } = useQuery<
    GetOpenApiQuery,
    GetOpenApiQueryVariables
  >(GET_OPEN_API_QUERY, {
    variables: {
      input: openApiInput,
    },
  })

  useEffect(() => {
    const onCompleted = (data: GetOpenApiQuery) => {
      const converted = YamlParser.safeLoad(data.getOpenApi.spec)

      setDocumentation(converted as OpenApi)
    }
    if (onCompleted) {
      if (onCompleted && data && !loading && !error) {
        onCompleted(data)
      } else {
        setDocumentation(null)
      }
    }
  }, [loading, data, error])

  return (
    <Box paddingTop={[3, 3, 4]} paddingBottom={[0, 0, 6]}>
      {loading && (
        <Stack space={3} align="center">
          <LoadingIcon animate size={40} color="blue400" />
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
