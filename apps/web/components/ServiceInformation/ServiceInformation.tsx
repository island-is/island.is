import React from 'react'
import * as styles from './ServiceInformation.treat'
import {
  Box,
  GridColumn,
  GridRow,
  Inline,
  Tag,
  Text,
} from '@island.is/island-ui/core'
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
  const n = useNamespace(strings)

  const capitalize = (s: string) => {
    if (typeof s !== 'string') return ''

    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
  }

  const horizontalLine = () => {
    return <Box className={styles.underLine} />
  }

  const showDesktopTags = () => {
    return (
      <Box>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '6/12']} paddingTop="gutter">
            <Box className={styles.underLine} width="full">
              <Text variant="h3">{n('data')}</Text>
            </Box>
            <Inline space={1}>
              {service.data?.map((item) => (
                <Tag variant="white" outlined>
                  {n(`data${capitalize(item)}`)}
                </Tag>
              ))}
            </Inline>
          </GridColumn>
          <GridColumn span={['6/12', '6/12', '3/12']} paddingTop="gutter">
            <Box className={styles.underLine} width="full">
              <Text variant="h3">{n('type')}</Text>
            </Box>
            <Inline space={1}>
              {service.type?.map((item) => (
                <Tag variant="white" outlined>
                  {n(`type${capitalize(item)}`)}
                </Tag>
              ))}
            </Inline>
          </GridColumn>
          <GridColumn span={['6/12', '6/12', '3/12']} paddingTop="gutter">
            <Box className={styles.underLine} width="full">
              <Text variant="h3">{n('access')}</Text>
            </Box>
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
          <Text variant="h3">{n('serviceOwner')}</Text>
        </GridColumn>
        <GridColumn paddingTop="gutter">
          <Text variant="intro">{service.owner}</Text>
        </GridColumn>
      </GridRow>
      {showDesktopTags()}
    </Box>
  )
}
