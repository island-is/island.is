import React from 'react'
import { useNamespace } from '../../hooks'
import {
  Box,
  GridColumn,
  GridRow,
  Inline,
  Tag,
  Text,
  Divider,
  Link,
  Button,
  Select,
  GridContainer,
} from '@island.is/island-ui/core'
import {
  Service,
  GetNamespaceQuery,
  XroadInfo,
} from '@island.is/web/graphql/schema'

import TagList from './TagList'
import XroadValue from './XroadValue'

export const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}
export interface ServiceInformationProps {
  service: Service
  strings: GetNamespaceQuery['getNamespace']
}

export const ServiceInformation = ({
  service,
  strings,
}: ServiceInformationProps) => {
  const n = useNamespace(strings)

  return (
    // Heading
    <Box>
<<<<<<< HEAD
      <Inline space={1}>
        <Text variant="h1" as="h1">
          {service.title}
=======
      <Box marginTop={1} marginBottom={3}>
        <Box display="flex" alignItems="flexStart">
          <Text variant="h1" as="h1">
            {service.name}
          </Text>
          {service.pricing.length > 0 && (
            <Box marginLeft={1}>
              <Tag>{n(`pricing${capitalize(service.pricing[0])}`)}</Tag>
            </Box>
          )}
        </Box>
        <Text variant="intro" paddingTop={2}>
          {service.description}
>>>>>>> Ui of ServiceInfo
        </Text>
      </Box>

      <Box paddingBottom={3}>
        <Divider />
      </Box>

      <Box
        display="flex"
        flexDirection={['column', 'row']}
        justifyContent={['flexStart', 'spaceBetween']}
      >
        <GridContainer>
          <GridRow>
            <GridColumn span={['1/2', '1/3']}>
              <Select
                backgroundColor="blue"
                size="sm"
                label="Version"
                name="version"
                //disabled={options.length < 2}
                isSearchable={false}
                defaultValue={{ label: 'v1', value: 1 }}
                options={[
                  { label: 'v1', value: 1 },
                  { label: 'v2', value: 2 },
                  { label: 'v3', value: 2 },
                ]}
                //onChange={onSelectChange}
              />
            </GridColumn>
            <GridColumn span={['1/2', '1/3']}>
              <Select
                backgroundColor="blue"
                size="sm"
                label="Version"
                name="version"
                //disabled={options.length < 2}
                isSearchable={false}
                defaultValue={{ label: 'dev', value: 1 }}
                options={[
                  { label: 'dev', value: 1 },
                  { label: 'test', value: 2 },
                  { label: 'prod', value: 2 },
                ]}
                //onChange={onSelectChange}
              />
            </GridColumn>
          </GridRow>
        </GridContainer>

        <Box
          paddingTop={[2, 0]}
          display="flex"
          alignItems="center"
          justifyContent={['flexStart', 'flexEnd']}
        >
          <Box paddingRight={[3, 2]}>
            <Link href={'test'}>
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
          <Box>
            <Link href={'test'}>
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
        </Box>
      </Box>

      <Box
        background="blue100"
        paddingY={3}
        marginTop={3}
        borderRadius="large"
        display="flex"
        flexDirection="column"
      >
        {/* Xroad values */}
        {service &&
          service.xroadIdentifier &&
          service.xroadIdentifier.length > 0 && (
            <Box paddingX={3} marginBottom={2}>
              <Inline space={1}>
                <Text color="blue600">
                  {`${n('XroadIdentifierSubsystemCode')}:`}
                </Text>
                <Text color="blue600" fontWeight="semiBold">
                  {service.xroadIdentifier[0].subsystemCode}
                </Text>
              </Inline>
              <Box marginTop={1} display="flex">
                <Inline space={1}>
                  {/* IdentifierInstance */}
                  <XroadValue
                    label={`${n('XroadIdentifierInstance')}:`}
                    value={service.xroadIdentifier[0].instance}
                    showDivider
                  />
                  {/* memberCode */}
                  <XroadValue
                    label={`${n('XroadIdentifierMemberCode')}:`}
                    value={service.xroadIdentifier[0].memberCode}
                    showDivider
                  />
                  {/* memberClass */}
                  <XroadValue
                    label={`${n('XroadIdentifierMemberClass')}:`}
                    value={service.xroadIdentifier[0].memberClass}
                    showDivider
                  />
                  {/* serviceCode */}
                  <XroadValue
                    label={`${n('XroadIdentifierServiceCode')}:`}
                    value={service.xroadIdentifier[0].serviceCode}
                    showDivider={false}
                  />
                </Inline>
              </Box>
            </Box>
          )}
        <Box paddingBottom={3}>
          <Divider />
        </Box>
        <TagList
          data={service.data}
          type={service.type}
          access={service.access}
          namespace={strings}
        />
      </Box>
      {/* Links */}
      <Box display="flex" marginTop={3}>
        <Box paddingRight={3}>
          <Link href={'www.mbl.is'}>
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
        <Box>
          <Link href={'www.mbl.is'}>
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
      </Box>
    </Box>
  )
}
