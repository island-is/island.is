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
    : [
        {
          label: n('openApiViewNoVersion'),
          value: {
            instance: '',
            memberClass: '',
            memberCode: '',
            serviceCode: '',
            subsystemCode: '',
          },
        },
      ]

  const selectOptionValueToGetOpenApiInput = (
    option: SelectOption,
  ): GetOpenApiInput => {
    return option.value
      ? option.value
      : {
          instance: '',
          memberClass: '',
          memberCode: '',
          serviceCode: '',
          subsystemCode: '',
        }
  }

  const [selectedOption, setSelectedOption] = useState<SelectOption>(options[0])

  const onSelectChange = (option: SelectOption) => {
    if (!option.value) return

    setSelectedOption(option)
    setOpenApi(selectOptionValueToGetOpenApiInput(option))
  }

  const [openApi, setOpenApi] = useState<GetOpenApiInput>(
    selectOptionValueToGetOpenApiInput(selectedOption),
  )
  const { data, loading, error } = useQuery(GET_OPEN_API_QUERY, {
    variables: {
      input: openApi,
    },
  })

  const ShowOpenApiDocumentation = (theSpec: any) => {
    const converted = YamlParser.safeLoad(theSpec)
    if (typeof converted === 'undefined') {
      return (
        <Box paddingY={2}>
          <AlertBanner
            title={n('openApiViewQueryErrorTitle')}
            description={n('openApiViewQueryErrorDescription')}
            variant="error"
          />
        </Box>
      )
    }

    return (
      <OpenApiDocumentation
        spec={converted as OpenApi}
        linkTitle={n('openApiDocumentationLinkTitle')}
        documentationLinkText={n('openApiDocumentationLinkDocumentation')}
        responsiblePartyLinkText={n('openApiDocumentationLinkResponsibleParty')}
        bugReportLinkText={n('openApiDocumentationLinkBugReport')}
        featureRequestLinkText={n('openApiDocumentationLinkFeatureRequest')}
      />
    )
  }

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
            {n('openApiDocumentationTitle')}
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
            disabled={options.length < 2}
            isSearchable={false}
            defaultValue={selectedOption}
            options={options}
            onChange={onSelectChange}
          />
        </GridColumn>
      </GridRow>
      <Box>{loading && <LoadingIcon animate color="blue400" size={32} />}</Box>
      {error && (
        <Box paddingY={2}>
          <AlertBanner
            title={n('openApiViewLoadErrorTitle')}
            description={n('openApiViewLoadErrorDescription')}
            variant="error"
          />
        </Box>
      )}

      <Box width="full">
        {!loading && !error && ShowOpenApiDocumentation(data?.getOpenApi.spec)}
      </Box>
    </Box>
  )
}
