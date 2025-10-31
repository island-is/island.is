import {
  LawAndOrderActionTypeEnum,
  LawAndOrderItemType,
  LawAndOrderSubpoenaItem,
} from '@island.is/api/schema'
import React from 'react'

import {
  Accordion,
  AccordionItem,
  Box,
  Divider,
  Link,
  Text,
} from '@island.is/island-ui/core'
import { InfoLine } from '@island.is/portals/my-pages/core'
import HtmlParser from 'react-html-parser'
import * as styles from './VerdictInfoLines.css'
export interface RenderItemProps {
  item: LawAndOrderSubpoenaItem
  loading?: boolean
  dividerOnBottom?: boolean
}

export const RenderItem: React.FC<RenderItemProps> = ({
  item,
  loading,
  dividerOnBottom,
}) => {
  switch (item.type) {
    case LawAndOrderItemType.Text:
      return (
        <Text variant="default" marginBottom={2}>
          {item.value}
        </Text>
      )
    case LawAndOrderItemType.RichText:
      return <Box> {HtmlParser(String(item.value))}</Box>
    case LawAndOrderItemType.Accordion:
      return (
        <div className={styles.htmlContainer}>
          <Accordion space={2} dividerOnBottom={dividerOnBottom}>
            <AccordionItem
              id={`accordion-${item.label ?? ''}`}
              label={item.label ?? ''}
            >
              {HtmlParser(String(item.value))}
            </AccordionItem>
          </Accordion>
        </div>
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
                  href={item.link}
                  color="blue400"
                >
                  {item.link}
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
