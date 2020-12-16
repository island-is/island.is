import React from 'react'
import {
  Box,
  GridColumn,
  GridRow,
  Inline,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { ApiService, GetNamespaceQuery } from '@island.is/web/graphql/schema'
import { useNamespace } from '../../hooks'

const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

export interface ServiceInformationProps {
  service: ApiService
  strings: GetNamespaceQuery['getNamespace']
}

export const ServiceInformation = ({
  service,
  strings,
}: ServiceInformationProps) => {
  const n = useNamespace(strings)

  const showTags = () => {
    return (
      <Box>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/12']} paddingTop="gutter">
            <Box
              paddingBottom="gutter"
              borderBottomWidth="standard"
              borderStyle="solid"
              borderColor="blue200"
              marginBottom={3}
              width="full"
            >
              <Text variant="h3" as="h3">
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
            <Box
              paddingBottom="gutter"
              borderBottomWidth="standard"
              borderStyle="solid"
              borderColor="blue200"
              marginBottom={3}
              width="full"
            >
              <Text variant="h3" as="h3">
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
            <Box
              paddingBottom="gutter"
              borderBottomWidth="standard"
              borderStyle="solid"
              borderColor="blue200"
              marginBottom={3}
              width="full"
            >
              <Text variant="h3" as="h3">
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
    )
  }
  // Main page
  return (
    <Box>
      <Text variant="h1" as="h1">
        {service.name}
      </Text>
      <Text variant="h3" as="h3" paddingTop="gutter">
        {`${n('serviceOwner')}: ${service.owner}`}
      </Text>
      {service.pricing.length > 0 && (
        <Box>
          <Tag variant="white" outlined>
            {n(`pricing${capitalize(service.pricing[0])}`)}
          </Tag>
        </Box>
      )}
      <Text variant="intro" paddingTop="gutter">
        {service.description}
      </Text>
      {showTags()}
    </Box>
  )
}
