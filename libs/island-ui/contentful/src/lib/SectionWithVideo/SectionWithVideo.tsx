import { FC } from 'react'
import type { Document } from '@contentful/rich-text-types'
import {
  Box,
  Button,
  GridColumn,
  GridColumnProps,
  GridRow,
  LinkV2,
  Text,
} from '@island.is/island-ui/core'
import { richText } from '../RichTextRC/RichText'
import { Slice as SliceType } from '../richTextRendering'
import EmbeddedVideo from '../EmbeddedVideo/EmbeddedVideo'

const COLUMN_SPAN: GridColumnProps['span'] = [
  '12/12',
  '12/12',
  '12/12',
  '12/12',
  '6/12',
]

export interface SectionWithVideoProps {
  title: string
  html?: { __typename: 'Html'; id: string; document: Document }
  link?: { text: string; url: string }
  video?: { url: string; title: string; locale: string }
  locale: string
}

export const SectionWithVideo: FC<SectionWithVideoProps> = ({
  title,
  html,
  link,
  video,
  locale,
}) => {
  return (
    <Box>
      <GridRow>
        {video?.url && (
          <GridColumn span={COLUMN_SPAN}>
            <EmbeddedVideo url={video.url} locale={locale} title={title} />
          </GridColumn>
        )}
        <GridColumn
          span={video?.url ? COLUMN_SPAN : '12/12'}
          paddingTop={video?.url ? [2, 2, 2, 2, 0] : 0}
        >
          {title && <Text variant="h2">{title}</Text>}
          {html?.document && richText([html] as SliceType[])}
          {link && link.url && (
            <Box marginTop={3}>
              <LinkV2 href={link.url}>
                <Button
                  unfocusable={true}
                  icon="arrowForward"
                  iconType="filled"
                  type="button"
                  variant="text"
                >
                  {link.text}
                </Button>
              </LinkV2>
            </Box>
          )}
        </GridColumn>
      </GridRow>
    </Box>
  )
}
