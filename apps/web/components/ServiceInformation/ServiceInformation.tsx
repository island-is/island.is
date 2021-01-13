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
  ApiService,
  GetNamespaceQuery,
  XroadInfo,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '../../hooks'

const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

export interface ServiceInformationProps {
  service: ApiService
  strings: GetNamespaceQuery['getNamespace']
  selectedInfo?: XroadInfo
}

export const ServiceInformation = ({
  service,
  strings,
  selectedInfo,
}: ServiceInformationProps) => {
  const n = useNamespace(strings)

  const XroadIdentifierText = (info: XroadInfo): string => {
    let ret = ''

    if (info.instance && info.instance.length > 0)
      ret += `${n('XroadIdentifierInstance')}: "${info.instance}".  `

    if (info.memberCode && info.memberCode.length > 0)
      ret += `${n('XroadIdentifierMemberCode')}: "${info.memberCode}".  `

    if (info.memberClass && info.memberClass.length > 0)
      ret += `${n('XroadIdentifierMemberClass')}: "${info.memberClass}".  `

    if (info.serviceCode && info.serviceCode.length > 0)
      ret += `${n('XroadIdentifierServiceCode')}: "${info.serviceCode}".  `

    return ret
  }

  return (
    <Box paddingTop="gutter">
      <Inline space={1}>
        <Text variant="h1" as="h1">
          {service.name}
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
      {selectedInfo && (
        <Inline space={1}>
          <Text variant="eyebrow" as="span" paddingTop="gutter">
            {`${n('XroadIdentifierSubsystemCode')}: ${
              selectedInfo.subsystemCode
            } `}
          </Text>
          <Tooltip text={XroadIdentifierText(selectedInfo)} />
        </Inline>
      )}
      <Text variant="intro" paddingTop="smallGutter">
        {service.description}
      </Text>
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
              <Text variant="eyebrow" as="span">
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
              <Text variant="eyebrow" as="span">
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
              <Text variant="eyebrow" as="span">
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
  )
}
