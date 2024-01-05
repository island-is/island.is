import React from 'react'
import {
  Box,
  BoxProps,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Link,
  Text,
} from '@island.is/island-ui/core'
import { MultipleStatistics as MultipleStatisticsSchema } from '@island.is/web/graphql/schema'

interface SliceProps {
  slice: MultipleStatisticsSchema
}

export const MultipleStatistics: React.FC<
  React.PropsWithChildren<SliceProps>
> = ({ slice }) => {
  const boxProps: BoxProps = slice.hasBorderAbove
    ? {
        borderTopWidth: 'standard',
        borderColor: 'standard',
        paddingTop: [4, 4, 6],
        paddingBottom: [4, 4, 6],
      }
    : {
        paddingTop: 2,
        paddingBottom: 2,
      }

  return (
    <section
      key={slice.id}
      id={slice.id}
      aria-labelledby={'sliceTitle-' + slice.id}
    >
      <Box {...boxProps}>
        {!!slice.title && (
          <Text variant="h2" as="h2" marginBottom={4}>
            {slice.title}
          </Text>
        )}
        {slice.statistics.map((statistics) => (
          <Box>
            <Text as="h3" variant="h3" marginBottom={4}>
              {statistics.title}
            </Text>
            <GridContainer>
              <GridRow marginBottom={4}>
                {statistics.statistics.map((s) => (
                  <GridColumn span="1/5" paddingBottom={4}>
                    <Text variant="h1" color="blue400">
                      {s.value}
                    </Text>
                    <Text variant="h5">{s.label}</Text>
                  </GridColumn>
                ))}
              </GridRow>
            </GridContainer>
          </Box>
        ))}
        {slice.link && (
          <Box display="flex" justifyContent="flexEnd">
            <Link href={slice.link.url}>
              <Button
                icon="arrowForward"
                iconType="filled"
                type="button"
                variant="text"
              >
                {slice.link.text}
              </Button>
            </Link>
          </Box>
        )}
      </Box>
    </section>
  )
}
