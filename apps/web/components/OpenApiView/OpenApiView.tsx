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
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { OpenApi } from '@island.is/api-catalogue/types'
import { GET_OPEN_API_QUERY } from '@island.is/web/screens/queries'
import YamlParser from 'js-yaml'
import { OpenApiDocumentation } from '../OpenApiDocumentation'

export interface OpenApiViewProps {
  strings: GetNamespaceQuery['getNamespace']
  openApiInput: GetOpenApiInput
  backupSpec: string
}

export const OpenApiView = ({
  strings,
  openApiInput,
  backupSpec,
}: OpenApiViewProps) => {
  const n = useNamespace(strings)

  const [documentation, setDocumentation] = useState<OpenApi>(null)
  const [usingBackupSpec, setUsingBackupSpec] = useState<boolean>(false)

  const { data, loading, error } = useQuery(GET_OPEN_API_QUERY, {
    variables: {
      input: openApiInput,
    },
  })

  useEffect(() => {
    const onCompleted = (specification) => {
      const converted = YamlParser.safeLoad(specification)

      setDocumentation(converted as OpenApi)
    }
    if (onCompleted) {
      if (onCompleted && !loading && !error) {
        if (data?.getOpenApi?.spec.length) {
          console.log('using fresh: ' + data?.getOpenApi?.spec.length)
          setUsingBackupSpec(false)
          onCompleted(data.getOpenApi.spec)
        } else if (backupSpec) {
          console.log('using stale')
          onCompleted(backupSpec)
          setUsingBackupSpec(true)
        }
      } else {
        setDocumentation(null)
      }
    }
  }, [loading, data, error, backupSpec])

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
            <OpenApiDocumentation
              spec={documentation}
              liveSpecification={!usingBackupSpec}
            />
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
