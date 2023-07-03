import React from 'react'
import {
  Box,
  BoxProps,
  Button,
  GridContainer,
  Text,
} from '@island.is/island-ui/core'
import { OneColumnText } from '@island.is/web/graphql/schema'
import Link from 'next/link'
import { SliceType } from '@island.is/island-ui/contentful'
import { webRichText } from '@island.is/web/utils/richText'

interface SliceProps {
  slice: OneColumnText
}

export const OneColumnTextSlice: React.FC<
  React.PropsWithChildren<SliceProps>
> = ({ slice }) => {
  const boxProps: BoxProps = slice.dividerOnTop
    ? {
        borderTopWidth: 'standard',
        borderColor: 'standard',
        paddingTop: 4,
        paddingBottom: 4,
      }
    : {}

  return (
    <section
      key={slice.id}
      id={slice.id}
      aria-labelledby={'sliceTitle-' + slice.id}
    >
      <GridContainer>
        <Box {...boxProps}>
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
          {webRichText(slice.content as SliceType[])}
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
