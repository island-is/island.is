import React from 'react'
import { useWindowSize, useIsomorphicLayoutEffect } from 'react-use'
import {
  Box,
  GridColumn,
  GridRow,
  Inline,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { ApiService } from '@island.is/api/schema'
import { GetNamespaceQuery } from '@island.is/web/graphql/schema'
import { useNamespace } from '../../hooks'

export interface ServiceInformationProps {
  service: ApiService
  strings: GetNamespaceQuery['getNamespace']
}

export const ServiceInformation = ({
  service,
  strings,
}: ServiceInformationProps) => {
  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = React.useState(false)

  useIsomorphicLayoutEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  const n = useNamespace(strings)

  const capitalize = (s: string) => {
    if (typeof s !== 'string') return ''

    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
  }

  const horizontalLine = () => {
    return (
      <Box
        style={{
          borderBottomWidth: 1,
          borderBottomStyle: 'solid',
          borderBottomColor: theme.color.blue200,
        }}
      />
    )
  }
  const showMobileTags = () => {
    return (
      <Box>
        {/* Heading for data tags */}
        <GridRow>
          <GridColumn paddingTop="containerGutter">
            <Text variant="h3">{n('data')}</Text>
          </GridColumn>
        </GridRow>
        {horizontalLine()}
        {/* Tags for data  */}
        <GridRow>
          <GridColumn paddingTop="gutter">
            <Inline space={1}>
              {service.data?.map((item) => (
                <Tag variant="white" outlined>
                  {n(`data${capitalize(item)}`)}
                </Tag>
              ))}
            </Inline>
          </GridColumn>
        </GridRow>
        {/* Headings for type and access tags*/}
        <GridRow>
          <GridColumn span="2/4" paddingTop="containerGutter">
            <Text variant="h3">{n('type')}</Text>
          </GridColumn>
          <GridColumn span="2/4" paddingTop="containerGutter">
            <Text variant="h3">{n('access')}</Text>
          </GridColumn>
        </GridRow>
        {horizontalLine()}
        {/* Tags for type and access*/}
        <GridRow>
          <GridColumn span="2/4" paddingTop="gutter">
            <Inline space={1}>
              {service.type?.map((item) => (
                <Tag variant="white" outlined>
                  {n(`type${capitalize(item)}`)}
                </Tag>
              ))}
            </Inline>
          </GridColumn>
          <GridColumn span="2/4" paddingTop="gutter">
            <Inline space={1}>
              {service.access?.map((item) => (
                <Tag variant="white" outlined>
                  {n(`access${capitalize(item)}`)}
                </Tag>
              ))}
            </Inline>
          </GridColumn>
        </GridRow>
      </Box>
    )
  }
  const showDesktopTags = () => {
    return (
      <Box>
        {/* Headings for tags */}
        <GridRow>
          <GridColumn span="2/4" paddingTop="containerGutter">
            <Text variant="h3">{n('data')}</Text>
          </GridColumn>
          <GridColumn span="1/4" paddingTop="containerGutter">
            <Text variant="h3">{n('type')}</Text>
          </GridColumn>
          <GridColumn span="1/4" paddingTop="containerGutter">
            <Text variant="h3">{n('access')}</Text>
          </GridColumn>
        </GridRow>
        {horizontalLine()}
        {/* Tags */}
        <GridRow>
          <GridColumn span="2/4" paddingTop="gutter">
            <Inline space={1}>
              {service.data?.map((item) => (
                <Tag variant="white" outlined>
                  {n(`data${capitalize(item)}`)}
                </Tag>
              ))}
            </Inline>
          </GridColumn>
          <GridColumn span="1/4" paddingTop="gutter">
            <Inline space={1}>
              {service.type?.map((item) => (
                <Tag variant="white" outlined>
                  {n(`type${capitalize(item)}`)}
                </Tag>
              ))}
            </Inline>
          </GridColumn>
          <GridColumn span="1/4" paddingTop="gutter">
            <Inline space={1}>
              {service.access?.map((item) => (
                <Tag variant="white" outlined>
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
      <GridRow>
        <GridColumn>
          <Text variant="h1">{service.name}</Text>
        </GridColumn>
        {service.pricing.length > 0 && (
          <GridColumn>
            <Tag variant="white" outlined>
              {n(`pricing${capitalize(service.pricing[0])}`)}
            </Tag>
          </GridColumn>
        )}
      </GridRow>
      <GridRow>
        <GridColumn paddingTop="gutter">
          <Text variant="intro">{service.description}</Text>
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn paddingTop="gutter">
          <Text variant="h3">Framleiðandi</Text>
        </GridColumn>
        <GridColumn paddingTop="gutter">
          <Text variant="intro">{service.owner}</Text>
        </GridColumn>
      </GridRow>
      {isMobile ? showMobileTags() : showDesktopTags()}
    </Box>
  )
}
