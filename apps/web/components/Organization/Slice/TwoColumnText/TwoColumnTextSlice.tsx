import React, { useEffect, useState } from 'react'
import { useWindowSize } from 'react-use'

import { SliceType } from '@island.is/island-ui/contentful'
import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Hyphen,
  Link,
  Text,
} from '@island.is/island-ui/core'
import { SpanType } from '@island.is/island-ui/core/types'
import { theme } from '@island.is/island-ui/theme'
import { BorderAbove } from '@island.is/web/components'
import { TwoColumnText } from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'
import { webRichText } from '@island.is/web/utils/richText'

const columnSpan: SpanType = ['12/12', '12/12', '12/12', '12/12', '6/12']

interface SliceProps {
  slice: TwoColumnText
}

export const TwoColumnTextSlice: React.FC<
  React.PropsWithChildren<SliceProps>
> = ({ slice }) => {
  const { activeLocale } = useI18n()
  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(width < theme.breakpoints.lg)
  }, [width])

  const leftId = 'sliceLeftTitle-' + slice.id
  const rightId = 'sliceRightTitle-' + slice.id

  const sliceLabelIds = []

  if (slice.leftTitle) {
    sliceLabelIds.push(leftId)
  }
  if (slice.rightTitle) {
    sliceLabelIds.push(rightId)
  }

  const rightTitleIsSkipped =
    slice.rightTitle === '' ||
    slice.rightTitle === undefined ||
    slice.onlyUseOneTitle

  const leftTitleExist = slice.leftTitle !== ''

  const leftLinkNotExist = !slice.leftLink?.url

  const verticalAlignContentInMobile =
    rightTitleIsSkipped && leftTitleExist && leftLinkNotExist && isMobile

  const ariaLabelledBy = sliceLabelIds.join(' ')

  return (
    <section
      key={slice.id}
      id={slice.id}
      aria-labelledby={ariaLabelledBy ? ariaLabelledBy : undefined}
    >
      <GridContainer>
        {slice.dividerOnTop && <BorderAbove />}
        <Box>
          <GridRow>
            <GridColumn
              span={slice.onlyUseOneTitle ? '12/12' : columnSpan}
              hiddenBelow="xl"
            >
              {slice.leftTitle && (
                <Text variant="h2" as="h2" id={leftId}>
                  <Hyphen>{slice.leftTitle}</Hyphen>
                </Text>
              )}
            </GridColumn>
            {!slice.onlyUseOneTitle && (
              <GridColumn span={columnSpan} hiddenBelow="xl">
                {slice.rightTitle && (
                  <Text variant="h2" as="h2" id={rightId}>
                    <Hyphen>{slice.rightTitle}</Hyphen>
                  </Text>
                )}
              </GridColumn>
            )}
          </GridRow>
          <GridRow>
            <GridColumn span={columnSpan}>
              {slice.leftTitle && (
                <Hidden above="lg">
                  <Text variant="h2" as="h2">
                    {slice.leftTitle}
                  </Text>
                </Hidden>
              )}
              {webRichText(
                slice.leftContent as SliceType[],
                undefined,
                activeLocale,
              )}
              {slice.leftLink && slice.leftLink.url && (
                <Box paddingTop={2}>
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
                </Box>
              )}
            </GridColumn>
            <GridColumn
              span={columnSpan}
              paddingTop={
                verticalAlignContentInMobile ? [0, 0, 0, 0] : [2, 2, 2, 0]
              }
            >
              {!slice.onlyUseOneTitle && slice.rightTitle && (
                <Hidden above="lg">
                  <Text variant="h2" as="h2">
                    {slice.rightTitle}
                  </Text>
                </Hidden>
              )}
              <Box
                style={
                  verticalAlignContentInMobile ? { marginTop: '-10px' } : {}
                }
              >
                {webRichText(
                  slice.rightContent as SliceType[],
                  undefined,
                  activeLocale,
                )}
              </Box>
              {slice.rightLink && slice.rightLink.url && (
                <Box paddingTop={2}>
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
                </Box>
              )}
            </GridColumn>
          </GridRow>
        </Box>
      </GridContainer>
    </section>
  )
}
