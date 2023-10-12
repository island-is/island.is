import { ReactNode } from 'react'
import { BLOCKS } from '@contentful/rich-text-types'
import { FooterItem } from '@island.is/api/schema'
import { SliceType } from '@island.is/island-ui/contentful'
import { GridColumn, Text } from '@island.is/island-ui/core'
import { SpanType } from '@island.is/island-ui/core/types'
import { webRichText } from '@island.is/web/utils/richText'

interface Props {
  span: SpanType
  footerItems: FooterItem[]
}

const renderFooterItems = ({ span, footerItems }: Props) => {
  return footerItems.map((item, idx) => (
    <GridColumn span={span} key={item.id ? item.id : idx}>
      {item.title && (
        <Text marginTop={2} fontWeight="semiBold">
          {item.title}
        </Text>
      )}
      {webRichText(item.content as SliceType[], {
        renderNode: {
          [BLOCKS.PARAGRAPH]: (_node: never, children: ReactNode) => (
            <Text color="dark400" marginY={1}>
              {children}
            </Text>
          ),
        },
      })}
    </GridColumn>
  ))
}

export default renderFooterItems
