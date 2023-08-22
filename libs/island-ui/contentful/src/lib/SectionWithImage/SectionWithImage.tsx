import React, { FC } from 'react'
import { Document } from '@contentful/rich-text-types'
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
  html?: { __typename: 'Html'; id: string; document: Document }
}

export const SectionWithImage: FC<
  React.PropsWithChildren<SectionWithImageProps>
> = ({ title, image, html }) => {
  const htmlDocument = html?.document ?? null

  if (!image && htmlDocument) {
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
        {richText([html] as SliceType[], undefined)}
      </>
    )
  }

  return (
    <Box
      className={styles.sectionOffset}
      marginBottom={[3, 3, 12]}
      marginTop={[3, 3, 12]}
    >
      <GridRow>
        {!!image && (
          <GridColumn span={['12/12', '12/12', '12/12', '3/9']}>
            <Box className={styles.imageContainer}>
              <img className={styles.image} src={image.url + '?w=600'} alt="" />
            </Box>
          </GridColumn>
        )}
        <GridColumn span={['12/12', '12/12', '12/12', '6/9']}>
          {title && (
            <Text id={slugify(title)} variant="h2" as="h2" paddingBottom={2}>
              {title}
            </Text>
          )}
          {!!htmlDocument && richText([html] as SliceType[], undefined)}
        </GridColumn>
      </GridRow>
    </Box>
  )
}
