import React from 'react'
import { TwoColumnText } from '@island.is/web/graphql/schema'
import {
  Box,
  BoxProps,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Hyphen,
  Link,
  Text,
} from '@island.is/island-ui/core'
import { SliceType } from '@island.is/island-ui/contentful'
import { webRichText } from '@island.is/web/utils/richText'
import { SpanType } from '@island.is/island-ui/core/types'

const columnSpan: SpanType = ['12/12', '12/12', '12/12', '6/12']

interface SliceProps {
  slice: TwoColumnText
}

export const TwoColumnTextSlice: React.FC<
  React.PropsWithChildren<SliceProps>
> = ({ slice }) => {
  const labelId = 'sliceTitle-' + slice.id
  const boxProps: BoxProps = slice.dividerOnTop
    ? { borderTopWidth: 'standard', borderColor: 'standard', paddingTop: 4 }
    : {}
  return (
    <section key={slice.id} id={slice.id} aria-labelledby={labelId}>
      <GridContainer>
        <Box {...boxProps}>
          <GridRow>
            <GridColumn span={columnSpan} paddingBottom={2} hiddenBelow="lg">
              {slice.leftTitle && (
                <Text variant="h2" as="h2" id={labelId}>
                  <Hyphen>{slice.leftTitle}</Hyphen>
                </Text>
              )}
            </GridColumn>
            <GridColumn span={columnSpan} paddingBottom={2} hiddenBelow="lg">
              {slice.rightTitle && (
                <Text variant="h2" as="h2">
                  <Hyphen>{slice.rightTitle}</Hyphen>
                </Text>
              )}
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn span={columnSpan}>
              {slice.leftTitle && (
                <Hidden above="md">
                  <Text variant="h2" as="h2">
                    {slice.leftTitle}
                  </Text>
                </Hidden>
              )}
              {webRichText(slice.leftContent as SliceType[])}
              {slice.leftLink && slice.leftLink.url && (
                <Link href={slice.leftLink.url}>
                  <Button
                    icon="arrowForward"
                    iconType="filled"
                    type="button"
                    variant="text"
                  >
                    {slice.leftLink.text}
                  </Button>
                </Link>
              )}
            </GridColumn>
            <GridColumn span={columnSpan} paddingTop={[4, 4, 4, 0]}>
              {slice.rightTitle && (
                <Hidden above="md">
                  <Text variant="h2" as="h2">
                    {slice.rightTitle}
                  </Text>
                </Hidden>
              )}
              {webRichText(slice.rightContent as SliceType[])}
              {slice.rightLink && slice.rightLink.url && (
                <Link href={slice.rightLink.url}>
                  <Button
                    icon="arrowForward"
                    iconType="filled"
                    type="button"
                    variant="text"
                  >
                    {slice.rightLink.text}
                  </Button>
                </Link>
              )}
            </GridColumn>
          </GridRow>
        </Box>
      </GridContainer>
    </section>
  )
}
