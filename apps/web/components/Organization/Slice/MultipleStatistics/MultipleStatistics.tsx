import React from 'react'
import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Link,
  Text,
} from '@island.is/island-ui/core'
import { GridContainer } from '@island.is/web/components'
import { MultipleStatistics as MultipleStatisticsSchema } from '@island.is/web/graphql/schema'

interface SliceProps {
  slice: MultipleStatisticsSchema
}

export const MultipleStatistics: React.FC<SliceProps> = ({ slice }) => {
  return (
    <section key={slice.id} aria-labelledby={'sliceTitle-' + slice.id}>
      <Box
        borderTopWidth="standard"
        borderColor="standard"
        paddingTop={[4, 4, 6]}
        paddingBottom={[4, 4, 6]}
      >
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
