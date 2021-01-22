import React, { FC } from 'react'
import { useNamespace } from '@island.is/web/hooks'
import {
  Box,
  Inline,
  Tag,
  Text,
  GridColumn,
  GridContainer,
  GridRow,
} from '@island.is/island-ui/core'
import {
  DataCategory,
  TypeCategory,
  AccessCategory,
} from '@island.is/web/graphql/schema'
import { capitalize } from './ServiceInformation'

interface TagListProps {
  data: Array<DataCategory>
  type: Array<TypeCategory>
  access: Array<AccessCategory>
  namespace?: object
}

export const TagList: FC<TagListProps> = ({
  data,
  type,
  access,
  namespace,
}) => {
  const n = useNamespace(namespace)
  return (
    <Box paddingX={3}>
      <GridContainer>
        <GridRow>
          <GridColumn paddingBottom={[3, 0]} span={['12/12', '12/12', '6/12']}>
            <Box marginBottom={1}>
              <Text variant="eyebrow" as="span" color="blue600">
                {n('data')}
              </Text>
            </Box>
            <Inline space={1}>
              {data?.map((item) => (
                <Tag variant="white" outlined key={item}>
                  {n(`data${capitalize(item)}`)}
                </Tag>
              ))}
            </Inline>
          </GridColumn>
          <GridColumn paddingBottom={[3, 0]} span={['12/12', '12/12', '3/12']}>
            <Box marginBottom={1}>
              <Text variant="eyebrow" as="span" color="blue600">
                {n('type')}
              </Text>
            </Box>
            <Inline space={1}>
              {type?.map((item) => (
                <Tag variant="white" outlined key={item}>
                  {n(`type${capitalize(item)}`)}
                </Tag>
              ))}
            </Inline>
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '3/12']}>
            <Box marginBottom={1}>
              <Text variant="eyebrow" as="span" color="blue600">
                {n('access')}
              </Text>
            </Box>
            <Inline space={1}>
              {access?.map((item) => (
                <Tag variant="white" outlined key={item}>
                  {n(`access${capitalize(item)}`)}
                </Tag>
              ))}
            </Inline>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}
export default TagList
