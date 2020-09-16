import React, { FC } from 'react'
import { Document } from '@contentful/rich-text-types'
import { Text, GridRow, GridColumn, Box } from '@island.is/island-ui/core'
import slugify from '@sindresorhus/slugify'
import StaticHtml from '../StaticHtml/StaticHtml'
import { renderHtml } from '../richTextRendering'
import * as styles from './SectionWithImage.treat'

export interface SectionWithImageProps {
  title: string
  image?: {
    url: string
  }
  html?: { document: Document }
}

export const SectionWithImage: FC<SectionWithImageProps> = ({
  title,
  image,
  html,
}) => {
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
        <StaticHtml>{renderHtml(htmlDocument)}</StaticHtml>
      </>
    )
  }

  return (
    <GridRow>
      {!!image && (
        <GridColumn span={['12/12', '12/12', '12/12', '3/9']}>
          <Box marginBottom={3} className={styles.imageContainer}>
            <img className={styles.image} src={image.url + '?w=600'} alt="" />
          </Box>
        </GridColumn>
      )}
      <GridColumn span={['12/12', '12/12', '12/12', '6/9']}>
        {title && (
          <Text id={slugify(title)} variant="h2" as="h2" paddingBottom={3}>
            {title}
          </Text>
        )}
        {!!htmlDocument && <StaticHtml>{renderHtml(htmlDocument)}</StaticHtml>}
      </GridColumn>
    </GridRow>
  )
}
