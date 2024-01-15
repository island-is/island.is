import React from 'react'
import Link from 'next/link'

import { SliceType } from '@island.is/island-ui/contentful'
import { Box, Button, GridContainer, Text } from '@island.is/island-ui/core'
import { BorderAbove } from '@island.is/web/components'
import { OneColumnText } from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'
import { webRichText } from '@island.is/web/utils/richText'

interface SliceProps {
  slice: OneColumnText
}

export const OneColumnTextSlice: React.FC<
  React.PropsWithChildren<SliceProps>
> = ({ slice }) => {
  const { activeLocale } = useI18n()

  return (
    <section
      key={slice.id}
      id={slice.id}
      aria-labelledby={'sliceTitle-' + slice.id}
    >
      <GridContainer>
        {slice.dividerOnTop && <BorderAbove />}
        <Box>
          {slice.showTitle && (
            <Text
              variant="h2"
              as="h2"
              id={'sliceTitle-' + slice.id}
              paddingBottom={2}
            >
              {slice.title}
            </Text>
          )}
          {webRichText(slice.content as SliceType[], undefined, activeLocale)}
          {slice.link && slice.link.url && (
            <Link href={slice.link.url} legacyBehavior>
              <Button
                icon="arrowForward"
                iconType="filled"
                type="button"
                variant="text"
              >
                {slice.link.text}
              </Button>
            </Link>
          )}
        </Box>
      </GridContainer>
    </section>
  )
}
