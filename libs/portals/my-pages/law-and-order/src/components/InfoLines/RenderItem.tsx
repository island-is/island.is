import {
  LawAndOrderActionTypeEnum,
  LawAndOrderItemType,
  LawAndOrderSubpoenaItem,
} from '@island.is/api/schema'
import React from 'react'

import {
  Accordion,
  AccordionItem,
  Divider,
  Link,
  Text,
} from '@island.is/island-ui/core'
import { InfoLine } from '@island.is/portals/my-pages/core'
export interface RenderItemProps {
  item: LawAndOrderSubpoenaItem
  loading?: boolean
}

export const RenderItem: React.FC<RenderItemProps> = ({ item, loading }) => {
  switch (item.type) {
    case LawAndOrderItemType.Text:
      return (
        <Text variant="default" marginBottom={2}>
          {item.value}
        </Text>
      )
    case LawAndOrderItemType.RichText:
      return (
        <Text variant="default" marginBottom={2}>
          {item.value}
        </Text>
      )
    case LawAndOrderItemType.Accordion:
      return (
        <Accordion space={2}>
          <AccordionItem
            id={`accordion-${item.label ?? ''}`}
            label={item.label ?? ''}
          >
            {item.value}
          </AccordionItem>
        </Accordion>
      )
    default:
      return (
        <>
          <InfoLine
            loading={loading}
            label={item.label ?? ''}
            content={item.value ?? ''}
            labelColumnSpan={['1/1', '5/12']}
            valueColumnSpan={['1/1', '4/12']}
            buttonColumnSpan={['3/12']}
            renderContent={() =>
              item.link ? (
                <Link
                  underline="normal"
                  underlineVisibility="always"
                  href={item.link + item.value}
                  color="blue400"
                >
                  {item.value}
                </Link>
              ) : (
                <Text>{item.value}</Text>
              )
            }
            button={
              item.action?.type === LawAndOrderActionTypeEnum.url &&
              item.action?.title &&
              item.action.data
                ? {
                    type: 'link',
                    to: item.action?.data,
                    label: item.action?.title,
                    icon: 'arrowForward',
                  }
                : undefined
            }
          />
          <Divider />
        </>
      )
  }
}
