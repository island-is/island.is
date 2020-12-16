import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import {
  AlertBanner,
  Box,
  Text,
  GridColumn,
  GridRow,
  LoadingIcon,
  Select,
} from '@island.is/island-ui/core'
import {
  ApiService,
  GetOpenApiInput,
  GetNamespaceQuery,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { OpenApi } from '@island.is/api-catalogue/types'
import { GET_OPEN_API_QUERY } from '@island.is/web/screens/queries'

import YamlParser from 'js-yaml'
import { OpenApiDocumentation } from '..'

export interface OpenApiViewProps {
  service: ApiService
  strings: GetNamespaceQuery['getNamespace']
}

type SelectOption = {
  label: string
  value: any
}

export const OpenApiView = ({ service, strings }: OpenApiViewProps) => {
  const n = useNamespace(strings)

  const options: Array<SelectOption> = service
    ? service.xroadIdentifier.map((x) => ({
        label: x.serviceCode.split('-').pop(),
        value: {
          instance: x.instance,
          memberClass: x.memberClass,
          memberCode: x.memberCode,
          serviceCode: x.serviceCode,
          subsystemCode: x.subsystemCode,
        },
      }))
    : [{ label: 'loading', value: null }]

  const onSelectChange = (option: SelectOption) => {
    console.log('onSelectChange')
    setOpenApi(option.value)
  }

  const [openApi, setOpenApi] = useState<GetOpenApiInput>(options[0].value)
  const { data, loading, error } = useQuery(GET_OPEN_API_QUERY, {
    variables: {
      input: openApi,
    },
  })

  return (
    <Box>
      <script
        id="redoc"
        type="text/javascript"
        src="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js"
      ></script>

      <GridRow align="spaceBetween">
        <GridColumn
          span={['8/8', '4/8', '4/8', '2/8']}
          paddingTop="containerGutter"
          paddingBottom="containerGutter"
        >
          <Text color="blue600" variant="h4" as="h4">
            {n('OpenApiDocumentationTitle')}
          </Text>
        </GridColumn>
        <GridColumn
          span={['8/8', '4/8', '4/8', '2/8']}
          paddingTop="containerGutter"
          paddingBottom="containerGutter"
        >
          <Select
            label="Version"
            name="version"
            isSearchable={false}
            defaultValue={options[0]}
            options={options}
            onChange={onSelectChange}
            noOptionsMessage="Engar útgáfuupplýsingar"
          />
        </GridColumn>
      </GridRow>
      <Box>{}</Box>
      <Box>{loading && <LoadingIcon animate color="blue400" size={32} />}</Box>
      {error && (
        <Box paddingY={2}>
          <AlertBanner
            title="Error loading documentation"
            description="An error occurred when trying to load the open api documentation for this version of the service."
            variant="error"
          />
        </Box>
      )}

      {!loading && !error && (
        <OpenApiDocumentation
          spec={YamlParser.safeLoad(data?.getOpenApi.spec) as OpenApi}
        />
      )}
    </Box>
  )
}
