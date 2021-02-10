import React, { FC, ReactElement } from 'react'
import capitalize from 'lodash/capitalize'
import { useNamespace } from '@island.is/web/hooks'
import {
  Box,
  Inline,
  Tag,
  Text,
  GridColumn,
  GridContainer,
  GridRow,
  DialogPrompt,
  Tooltip,
} from '@island.is/island-ui/core'
import {
  DataCategory,
  TypeCategory,
  AccessCategory,
} from '@island.is/web/graphql/schema'

interface TagListProps {
  data: Array<DataCategory>
  type: TypeCategory
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
          <GridColumn
            paddingBottom={[3, 3, 0]}
            span={['12/12', '12/12', '6/12']}
          >
            <Inline space={1}>
              <Text variant="eyebrow" color="blue600" marginBottom={1}>
                {n('data')}
              </Text>
              <Tooltip placement="right" text={n('dataTooltipText')} />
            </Inline>
            <Inline space={1}>
              {data?.map((item) => (
                <DialogPrompt
                  baseId={`data-${item}-dialog`}
                  title={n(`data${capitalize(item)}`)}
                  description={n(`data${capitalize(item)}Description`)}
                  ariaLabel={`Show detailed description of ${item} data`}
                  disclosureElement={
                    <Box>
                      <Tooltip
                        placement="right"
                        as="span"
                        text={n(`data${capitalize(item)}Description`)}
                      >
                        <Tag variant="white" outlined key={item}>
                          {n(`data${capitalize(item)}`)}
                        </Tag>
                      </Tooltip>
                    </Box>
                  }
                  buttonTextCancel={n('closeDialog')}
                />
              ))}
            </Inline>
          </GridColumn>
          <GridColumn
            paddingBottom={[3, 3, 0]}
            span={['12/12', '12/12', '3/12']}
          >
            <Inline space={1}>
              <Text variant="eyebrow" color="blue600" marginBottom={1}>
                {n('type')}
              </Text>
              <Tooltip placement="right" text={n('typeTooltipText')} />
            </Inline>
            <Inline space={1}>
              <DialogPrompt
                baseId={`type-${type}-dialog`}
                title={n(`type${capitalize(type)}`)}
                description={n(`type${capitalize(type)}Description`)}
                ariaLabel={`Show detailed description of ${type} type`}
                disclosureElement={
                  <Box>
                    <Tooltip
                      placement="right"
                      as="span"
                      text={n(`type${capitalize(type)}Description`)}
                    >
                      <Tag variant="white" outlined key={type}>
                        {n(`type${capitalize(type)}`)}
                      </Tag>
                    </Tooltip>
                  </Box>
                }
                buttonTextCancel={n('closeDialog')}
              />
            </Inline>
          </GridColumn>
          <GridColumn span={['12/12', '12/12', '3/12']}>
            <Inline space={1}>
              <Text variant="eyebrow" color="blue600" marginBottom={1}>
                {n('access')}
              </Text>
              <Tooltip placement="right" text={n('accessTooltipText')} />
            </Inline>
            <Inline space={1}>
              {access?.map((item) => (
                <DialogPrompt
                  baseId={`access-${item}-dialog`}
                  title={n(`access${capitalize(item)}`)}
                  description={n(`access${capitalize(item)}Description`)}
                  ariaLabel={`Show detailed description of ${item} access`}
                  disclosureElement={
                    <Box>
                      <Tooltip
                        placement="right"
                        as="span"
                        text={n(`access${capitalize(item)}Description`)}
                      >
                        <Tag variant="white" outlined key={item}>
                          {n(`access${capitalize(item)}`)}
                        </Tag>
                      </Tooltip>
                    </Box>
                  }
                  buttonTextCancel={n('closeDialog')}
                />
              ))}
            </Inline>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}
export default TagList
