import React from 'react'
import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
  Link,
  Hidden,
} from '@island.is/island-ui/core'
import { EventSlice as EventSliceProps } from '@island.is/web/graphql/schema'
import * as styles from './EventSlice.css'

interface SliceProps {
  slice: EventSliceProps
}

export const EventSlice: React.FC<SliceProps> = ({ slice }) => {
  const date = slice.date.split('-')

  return (
    <section key={slice.id} aria-labelledby={'sliceTitle-' + slice.id}>
      <Box
        className={styles.wrapper}
        style={{
          background: `url(${slice.backgroundImage?.url}), rgb(31, 101, 251)`,
        }}
      >
        <GridContainer>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '2/12']}>
              <Box
                display="flex"
                flexDirection={['row', 'row', 'column']}
                paddingBottom={[2, 2, 0]}
                justifyContent="spaceBetween"
                alignItems="center"
                height="full"
              >
                <Box display="flex" flexDirection={['row', 'row', 'column']}>
                  <Text color="white" variant="h1">
                    {date[2]}
                  </Text>
                  <Hidden above="sm">
                    <Text color="white" variant="h1">
                      .
                    </Text>
                  </Hidden>
                  <Text color="white" variant="h1">
                    {date[1]}
                  </Text>
                </Box>
                <Box>
                  <Text color="white" variant="h2">
                    {date[0]}
                  </Text>
                </Box>
              </Box>
            </GridColumn>
            <GridColumn
              span={['12/12', '12/12', '9/12']}
              offset={['0', '0', '1/12']}
            >
              <Text color="white" variant="h1">
                {slice.title}
              </Text>
              <Text
                color="white"
                variant="intro"
                marginTop={4}
                marginBottom={20}
              >
                {slice.subtitle}
              </Text>
              <Box display="flex" justifyContent="flexEnd">
                {!!slice.link && (
                  <Link href={slice.link?.url}>
                    <Button colorScheme="light">{slice.link?.text}</Button>
                  </Link>
                )}
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
    </section>
  )
}
