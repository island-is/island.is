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
import * as styles from './OpenApiView.treat'

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
          label: n('noVersion'),
          value: {
            instance: '',
            memberClass: '',
            memberCode: '',
            serviceCode: '',
            subsystemCode: '',
          },
        },
      ]

  //sort in descending order, highest version first
  options.sort((a, b) => (a.value.serviceCode < b.value.serviceCode ? 1 : -1))

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
            title={n('queryErrorTitle')}
            description={n('queryErrorText')}
            variant="error"
          />
        </Box>
      )
    }

    return (
      <OpenApiDocumentation
        spec={converted as OpenApi}
        linkTitle={n('linkTitle')}
        documentationLinkText={n('linkDocumentation')}
        responsiblePartyLinkText={n('linkResponsible')}
        bugReportLinkText={n('linkBugReport')}
        featureRequestLinkText={n('linkFeatureRequest')}
      />
    )
  }

  return (
    <Box>
      <GridRow align="spaceBetween">
        <GridColumn
          span={['8/8', '4/8', '4/8', '2/8']}
          paddingTop="containerGutter"
          paddingBottom="containerGutter"
        >
          <Text color="blue600" variant="h4" as="h4">
            {n('title')}
          </Text>
        </GridColumn>
        <GridColumn
          span={['8/8', '4/8', '4/8', '2/8']}
          paddingTop="containerGutter"
          paddingBottom="containerGutter"
          className={styles.bringFront}
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
            title={n('loadErrorTitle')}
            description={n('loadErrorText')}
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
