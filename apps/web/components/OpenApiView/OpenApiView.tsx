import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import {
  AlertBanner,
  Box,
  Text,
  LoadingIcon,
  Select,
  Stack,
  Link,
  Button,
} from '@island.is/island-ui/core'
import {
  ApiService,
  GetOpenApiInput,
  GetNamespaceQuery,
  XroadInfo,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { OpenApi, LinksObject } from '@island.is/api-catalogue/types'
import { GET_OPEN_API_QUERY } from '@island.is/web/screens/queries'
import YamlParser from 'js-yaml'
import { OpenApiDocumentation } from '..'
import * as styles from './OpenApiView.treat'

export interface OpenApiViewProps {
  service: ApiService
  strings: GetNamespaceQuery['getNamespace']
  onSelectChange?: (selected: XroadInfo) => void
}

type SelectOption = {
  label: string
  value: any
}

export const OpenApiView = ({
  service,
  strings,
  onSelectChange,
}: OpenApiViewProps) => {
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

  const onInnerSelectChange = (option: SelectOption) => {
    if (!option.value) return

    setSelectedOption(option)
    const input = selectOptionValueToGetOpenApiInput(option)
    setOpenApiInput(input)

    if (onSelectChange) {
      onSelectChange(input)
    }
  }

  const [documentation, setDocumentation] = useState<OpenApi>(null)
  const [openApiInput, setOpenApiInput] = useState<GetOpenApiInput>(
    selectOptionValueToGetOpenApiInput(selectedOption),
  )
  const { data, loading, error } = useQuery(GET_OPEN_API_QUERY, {
    variables: {
      input: openApiInput,
    },
  })

  useEffect(() => {
    const onCompleted = (data) => {
      const converted = YamlParser.safeLoad(data.getOpenApi.spec)

      setDocumentation(converted as OpenApi)
    }
    if (onCompleted) {
      if (onCompleted && !loading && !error) {
        onCompleted(data)
      } else {
        setDocumentation(null)
      }
    }
  }, [loading, data, error])

  const showTextLinks = (links: LinksObject) => {
    return (
      (links.documentation || links.responsibleParty) && (
        <Box
          display="flex"
          marginRight={[0, 0, 0, 0, 2]}
          justifyContent={[
            'spaceBetween',
            'spaceBetween',
            'flexStart',
            'flexEnd',
          ]}
          marginTop={['gutter', 'gutter', 'none']}
          marginBottom={['gutter', 'gutter', 'none']}
        >
          {links.documentation && (
            <Box
              display="flex"
              marginRight={[0, 0, 1, 1, 2]}
              alignItems="center"
            >
              <Link href={links.documentation}>
                <Button
                  fluid
                  iconType="outline"
                  icon="open"
                  colorScheme="light"
                  size="small"
                  variant="text"
                >
                  {n('linkDocumentation')}
                </Button>
              </Link>
            </Box>
          )}
          {links.responsibleParty && (
            <Box
              display="flex"
              marginRight={[0, 0, 1, 1, 2]}
              alignItems="center"
            >
              <Link href={links.responsibleParty}>
                <Button
                  fluid
                  iconType="outline"
                  icon="open"
                  colorScheme="light"
                  size="small"
                  variant="text"
                >
                  {n('linkResponsible')}
                </Button>
              </Link>
            </Box>
          )}
        </Box>
      )
    )
  }

  const showButtonLinks = (links: LinksObject) => {
    return (
      (links.bugReport || links.featureRequest) && (
        <Box
          display="flex"
          marginRight={[0, 0, 0, 0, 2]}
          alignItems="center"
          justifyContent={[
            'spaceBetween',
            'spaceBetween',
            'flexStart',
            'flexEnd',
          ]}
          marginBottom={['gutter', 'gutter', 'none']}
        >
          {links.bugReport && (
            <Box display="flex" marginRight={[0, 0, 1, 1, 2]}>
              <Link href={links.bugReport}>
                <Button
                  colorScheme="light"
                  iconType="filled"
                  size="small"
                  type="button"
                  variant="utility"
                  fluid
                >
                  {n('linkBugReport')}
                </Button>
              </Link>
            </Box>
          )}
          {links.featureRequest && (
            <Box display="flex" marginRight={[0, 0, 1, 1, 2]}>
              <Link href={links.featureRequest}>
                <Button
                  colorScheme="light"
                  iconType="filled"
                  size="small"
                  type="button"
                  variant="utility"
                >
                  {n('linkFeatureRequest')}
                </Button>
              </Link>
            </Box>
          )}
        </Box>
      )
    )
  }

  return (
    <Box>
      {/* Top Line */}
      <Box
        display="flex"
        flexDirection={['column', 'column', 'column', 'row', 'row']}
        justifyContent={[
          'flexStart',
          'flexStart',
          'spaceBetween',
          'spaceBetween',
        ]}
      >
        <Box display="flex" alignItems="center">
          <Text color="blue600" variant="h4" as="h4" truncate>
            {n('title')}
          </Text>
        </Box>
        {/* Links and Select box */}
        <Box
          display="flex"
          flexDirection={['column', 'column', 'row', 'row']}
          justifyContent={[
            'flexStart',
            'spaceBetween',
            'spaceBetween',
            'flexEnd',
          ]}
        >
          {/* Links */}
          {documentation && documentation?.info['x-links'] && (
            <Box
              display="flex"
              flexDirection={['column', 'column', 'row']}
              justifyContent={[
                'flexStart',
                'flexStart',
                'flexStart',
                'flexStart',
                'flexEnd',
              ]}
            >
              {showTextLinks(documentation.info['x-links'])}
              {showButtonLinks(documentation.info['x-links'])}
            </Box>
          )}
          <Box className={styles.selectDesktop}>
            <Select
              size="sm"
              label="Version"
              name="version"
              disabled={options.length < 2}
              isSearchable={false}
              defaultValue={selectedOption}
              options={options}
              onChange={onInnerSelectChange}
            />
          </Box>
        </Box>
      </Box>
      <Box>
        {loading && (
          <Stack space={3} align="center">
            <LoadingIcon animate size={40} color="blue400" />
            <Text variant="h4" color="blue600">
              {n('gettingDocumentation')}
            </Text>
          </Stack>
        )}
      </Box>
      {error && (
        <Box paddingY={2}>
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
            <Box paddingY={2}>
              <AlertBanner
                title={n('queryErrorTitle')}
                description={n('queryErrorText')}
                variant="error"
              />
            </Box>
          ))}
      </Box>
    </Box>
  )
}
