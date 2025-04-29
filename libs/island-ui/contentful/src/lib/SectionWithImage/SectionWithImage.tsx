import React, { FC } from 'react'
import { Text, GridRow, GridColumn, Box } from '@island.is/island-ui/core'
import slugify from '@sindresorhus/slugify'
import { Slice as SliceType } from '../richTextRendering'
import { richText } from '../RichTextRC/RichText'
import * as styles from './SectionWithImage.css'

export interface SectionWithImageProps {
  title: string
  image?: {
    url: string
  }
  content?: SliceType[]
  variant?: 'default' | 'even'
  contain?: boolean
  reverse?: boolean
}

export const SectionWithImage: FC<
  React.PropsWithChildren<SectionWithImageProps>
> = ({
  title,
  image,
  content = [],
  variant = 'default',
  contain = false,
  reverse = false,
}) => {
  if (!image && content.length > 0) {
    return (
      <>
        {title && (
          <Text
            id={slugify(title)}
            variant="h2"
            as="h2"
            paddingTop={2}
            paddingBottom={2}
          >
            {title}
          </Text>
        )}
        {richText(content as SliceType[], undefined)}
      </>
    )
  }

  return (
    <Box
      className={contain ? {} : styles.sectionOffset}
      marginBottom={[3, 3, 12]}
      marginTop={[3, 3, 12]}
    >
      <GridRow direction={reverse ? 'rowReverse' : 'row'}>
        {!!image && (
          <GridColumn
            span={[
              '12/12',
              '12/12',
              '12/12',
              variant === 'even' ? '6/12' : '3/9',
            ]}
          >
            <Box className={styles.imageContainer}>
              <img className={styles.image} src={image.url + '?w=600'} alt="" />
            </Box>
          </GridColumn>
        )}
        <GridColumn
          span={[
            '12/12',
            '12/12',
            '12/12',
            variant === 'even' ? '6/12' : '6/9',
          ]}
        >
          {title && (
            <Text id={slugify(title)} variant="h2" as="h2" paddingBottom={2}>
              {title}
            </Text>
          )}
          {content.length > 0 && richText(content as SliceType[], undefined)}
        </GridColumn>
      </GridRow>
    </Box>
  )
}
