import React from 'react'
import {
  Box,
  GridColumn,
  GridRow,
  Inline,
  Tag,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import {
  Service,
  GetNamespaceQuery,
  XroadInfo,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '../../hooks'

const capitalize = (s: string) => {
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
    <Box>
      <Inline space={1}>
        <Text variant="h1" as="h1">
          {service.title}
        </Text>
        {service.pricing.length > 0 && (
          <Box>
            <Tag variant="white" outlined>
              {n(`pricing${capitalize(service.pricing[0])}`)}
            </Tag>
          </Box>
        )}
      </Inline>
      <Text variant="eyebrow" as="span" paddingTop="gutter">
        {`${n('serviceOwner')}: ${service.owner}`}
      </Text>
      <Text variant="intro" paddingTop="smallGutter">
        {service.description}
      </Text>
      <Box
        marginY={3}
        borderTopWidth="standard"
        borderStyle="solid"
        borderColor="blue200"
        width="full"
      ></Box>
      <Box background="blue100" paddingY={3} borderRadius="large">
        {/* Xroad values */}
        {service &&
          service.xroadIdentifier &&
          service.xroadIdentifier.length > 0 && (
            <Box>
              <Box paddingX={3}>
                <Inline space={1}>
                  <Text paddingTop="gutter" color="blue600">
                    {`${n('XroadIdentifierSubsystemCode')}:`}
                  </Text>
                  <Text
                    paddingTop="gutter"
                    color="blue600"
                    fontWeight="semiBold"
                  >
                    {service.xroadIdentifier[0].subsystemCode}
                  </Text>
                </Inline>
              </Box>
              <Box
                paddingTop="smallGutter"
                borderBottomWidth="standard"
                borderColor="blue200"
                paddingX={3}
                paddingBottom="gutter"
              >
                <Inline space={1}>
                  {/* instance */}
                  <Text variant="small" color="blue600">
                    {`${n('XroadIdentifierInstance')}:`}
                  </Text>
                  <Text variant="small" color="blue600" fontWeight="semiBold">
                    {service.xroadIdentifier[0].instance}
                  </Text>
                  <Text variant="small" color="blue600">
                    |
                  </Text>
                  {/* memberCode */}
                  <Text variant="small" color="blue600">
                    {`${n('XroadIdentifierMemberCode')}:`}
                  </Text>
                  <Text variant="small" color="blue600" fontWeight="semiBold">
                    {service.xroadIdentifier[0].memberCode}
                  </Text>
                  <Text variant="small" color="blue600">
                    |
                  </Text>
                  {/* memberClass */}
                  <Text variant="small" color="blue600">
                    {`${n('XroadIdentifierMemberClass')}:`}
                  </Text>
                  <Text variant="small" color="blue600" fontWeight="semiBold">
                    {service.xroadIdentifier[0].memberClass}
                  </Text>
                  <Text variant="small" color="blue600">
                    |
                  </Text>
                  {/* serviceCode */}
                  <Text variant="small" color="blue600">
                    {`${n('XroadIdentifierServiceCode')}:`}
                  </Text>
                  <Text variant="small" color="blue600" fontWeight="semiBold">
                    {service.xroadIdentifier[0].serviceCode}
                  </Text>
                </Inline>
              </Box>
            </Box>
          )}
        <Box paddingX={3}>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '6/12']} paddingTop="gutter">
              <Box paddingBottom="gutter" width="full">
                <Text variant="eyebrow" as="span" color="blue600">
                  {n('data')}
                </Text>
              </Box>
              <Inline space={1}>
                {service.data?.map((item) => (
                  <Tag variant="white" outlined key={item}>
                    {n(`data${capitalize(item)}`)}
                  </Tag>
                ))}
              </Inline>
            </GridColumn>
            <GridColumn span={['6/12', '6/12', '3/12']} paddingTop="gutter">
              <Box paddingBottom="gutter" width="full">
                <Text variant="eyebrow" as="span" color="blue600">
                  {n('type')}
                </Text>
              </Box>
              <Inline space={1}>
                {service.type?.map((item) => (
                  <Tag variant="white" outlined key={item}>
                    {n(`type${capitalize(item)}`)}
                  </Tag>
                ))}
              </Inline>
            </GridColumn>
            <GridColumn span={['6/12', '6/12', '3/12']} paddingTop="gutter">
              <Box paddingBottom="gutter" width="full">
                <Text variant="eyebrow" as="span" color="blue600">
                  {n('access')}
                </Text>
              </Box>
              <Inline space={1}>
                {service.access?.map((item) => (
                  <Tag variant="white" outlined key={item}>
                    {n(`access${capitalize(item)}`)}
                  </Tag>
                ))}
              </Inline>
            </GridColumn>
          </GridRow>
        </Box>
      </Box>
    </Box>
  )
}
