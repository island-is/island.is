import React from 'react'
import { TwoColumnText } from '@island.is/web/graphql/schema'
import {
  Box,
  BoxProps,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Text,
} from '@island.is/island-ui/core'
import { richText, SliceType } from '@island.is/island-ui/contentful'

interface SliceProps {
  slice: TwoColumnText
}

export const TwoColumnTextSlice: React.FC<SliceProps> = ({ slice }) => {
  const labelId = 'sliceTitle-' + slice.id
  const boxProps: BoxProps = slice.dividerOnTop
    ? { borderTopWidth: 'standard', borderColor: 'standard', paddingTop: 4 }
    : {}

  return (
    <section key={slice.id} aria-labelledby={labelId}>
      <GridContainer>
        <Box {...boxProps}>
          <GridRow>
            <GridColumn
              span={['12/12', '12/12', '6/12']}
              paddingBottom={2}
              hiddenBelow="md"
            >
              <Text variant="h2" as="h2" id={labelId}>
                {slice.leftTitle}
              </Text>
            </GridColumn>
            <GridColumn
              span={['12/12', '12/12', '6/12']}
              paddingBottom={2}
              hiddenBelow="md"
            >
              {slice.rightTitle && (
                <Text variant="h2" as="h2">
                  {slice.rightTitle}
                </Text>
              )}
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '6/12']}>
              {slice.leftTitle && (
                <Hidden above="sm">
                  <Text variant="h2" as="h2">
                    {slice.leftTitle}
                  </Text>
                </Hidden>
              )}
              {richText(slice.leftContent as SliceType[])}
            </GridColumn>
            <GridColumn
              span={['12/12', '12/12', '6/12']}
              paddingTop={[4, 4, 0]}
            >
              {slice.rightTitle && (
                <Hidden above="sm">
                  <Text variant="h2" as="h2">
                    {slice.rightTitle}
                  </Text>
                </Hidden>
              )}
              {richText(slice.rightContent as SliceType[])}
            </GridColumn>
          </GridRow>
        </Box>
      </GridContainer>
    </section>
  )
}
