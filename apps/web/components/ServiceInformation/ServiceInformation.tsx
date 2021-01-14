import React from 'react'
import {
  Box,
  DialogPrompt,
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
  documentationInfo?: any
}

export const ServiceInformation = ({
  service,
  strings,
  selectedInfo,
  documentationInfo,
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
            <DialogPrompt
              baseId={`dialog-pricing${capitalize(service.pricing[0])}`}
              title={n(`pricing${capitalize(service.pricing[0])}`)}
              description={n(
                `pricing${capitalize(service.pricing[0])}Description`,
              )}
              ariaLabel={`Description for data${capitalize(service.pricing[0])}`}
              disclosureElement={
                <Tag variant="white" outlined>
                  {n(`pricing${capitalize(service.pricing[0])}`)}
                </Tag>
              }
            />
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
                {n('data')}{' '}
              </Text>
              <Tooltip text="Merkingar í þessum lið segja til um eðli gagna sem þjónustan vinnur með. Þú getur smellt á hvert merki fyrir sig til að fá nánari upplýsingar um það." />
            </Box>
            <Inline space={1}>
              {service.data?.map((item) => (
                <DialogPrompt
                  baseId={`dialog-data${capitalize(item)}`}
                  title={n(`data${capitalize(item)}`)}
                  description={n(`data${capitalize(item)}Description`)}
                  ariaLabel={`Description for data${capitalize(item)}`}
                  disclosureElement={
                    <Tag variant="white" outlined>
                      {n(`data${capitalize(item)}`)}
                    </Tag>
                  }
                />
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
                {n('type')}{' '}
              </Text>
              <Tooltip text="Merkingar í þessum lið segja til um tækni sem nota þarf í samskiptum við þjónustuna.  Þú getur smellt á hvert merki fyrir sig til að fá nánari upplýsingar um það." />
            </Box>
            <Inline space={1}>
              {service.type?.map((item) => (
                <DialogPrompt
                  baseId={`dialog-type${capitalize(item)}`}
                  title={n(`type${capitalize(item)}`)}
                  description={n(`type${capitalize(item)}Description`)}
                  ariaLabel={`Description for type${capitalize(item)}`}
                  disclosureElement={
                    <Tag variant="white" outlined key={item}>
                      {n(`type${capitalize(item)}`)}
                    </Tag>
                  }
                />
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
                {n('access')}{' '}
              </Text>
              <Tooltip text="Merkingar í þessum lið segja til um hvaðan þjónustan er aðgengileg.  Þú getur smellt á hvert merki fyrir sig til að fá nánari upplýsingar um það." />
            </Box>
            <Inline space={1}>
              {service.access?.map((item) => (
                <DialogPrompt
                  baseId={`dialog-access${capitalize(item)}`}
                  title={n(`access${capitalize(item)}`)}
                  description={n(`access${capitalize(item)}Description`)}
                  ariaLabel={`Description for access${capitalize(item)}`}
                  disclosureElement={
                    <Tag variant="white" outlined key={item}>
                      {n(`access${capitalize(item)}`)}
                    </Tag>
                  }
                />
              ))}
            </Inline>
          </GridColumn>
        </GridRow>
      </Box>
    </Box>
  )
}
