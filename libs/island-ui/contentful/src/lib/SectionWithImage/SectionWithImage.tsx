import React, { FC } from 'react'
import { Html } from '@island.is/api/schema'
import {
  Typography,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import slugify from '@sindresorhus/slugify'
import StaticHtml from '../StaticHtml/StaticHtml'
import { renderSlices } from '../richTextRendering'

export interface SectionWithImageProps {
  title?: string
  image?: {
    url: string
  }
  html: Html
}

export const SectionWithImage: FC<SectionWithImageProps> = ({
  title,
  image,
  html,
}) => {
  if (!image) {
    return (
      <>
        {title && (
          <Typography
            id={slugify(title)}
            variant="h2"
            as="h2"
            paddingTop={2}
            paddingBottom={2}
          >
            {title}
          </Typography>
        )}
        <StaticHtml>{renderSlices(html)}</StaticHtml>
      </>
    )
  }

  return (
    <GridContainer>
      <GridRow>
        <GridColumn span="3/9">
          <img src={image.url + '?w=320'} alt="" />
        </GridColumn>
        <GridColumn span="6/9">
          {title && (
            <Typography
              id={slugify(title)}
              variant="h2"
              as="h2"
              paddingBottom={3}
            >
              {title}
            </Typography>
          )}
          <StaticHtml>{renderSlices(html)}</StaticHtml>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}
