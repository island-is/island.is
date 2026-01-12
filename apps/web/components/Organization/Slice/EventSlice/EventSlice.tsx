import React from 'react'

import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Link,
  Logo,
  Text,
} from '@island.is/island-ui/core'
import { EventSlice as EventSliceProps } from '@island.is/web/graphql/schema'

import * as styles from './EventSlice.css'

interface SliceProps {
  slice: EventSliceProps
}

export const EventSlice: React.FC<React.PropsWithChildren<SliceProps>> = ({
  slice,
}) => {
  const date = slice.date.split('-')

  return (
    <section
      key={slice.id}
      id={slice.id}
      aria-labelledby={'sliceTitle-' + slice.id}
    >
      <Box
        className={styles.wrapper}
        style={{
          background: `url(${slice.backgroundImage?.url}), linear-gradient(135deg, rgba(0,3,65,1) 0%, rgba(0,84,235,1) 100%)`,
        }}
      >
        <GridContainer>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '12/12', '12/12', '2/12']}>
              <Box
                display="flex"
                flexDirection={['row', 'row', 'row', 'row', 'column']}
                paddingBottom={[2, 2, 2, 2, 0]}
                justifyContent="spaceBetween"
                alignItems="center"
                height="full"
              >
                <Box
                  display="flex"
                  flexDirection={['row', 'row', 'row', 'row', 'column']}
                  className={styles.textWrapper}
                  paddingTop={[0, 0, 0, 0, 4]}
                >
                  <Text color="mint400" variant="h1">
                    {date[2]}
                  </Text>
                  <Hidden above="lg">
                    <Text color="mint400" variant="h1">
                      .
                    </Text>
                  </Hidden>
                  <Text color="mint400" variant="h1">
                    {date[1]}
                  </Text>
                </Box>
              </Box>
            </GridColumn>
            <GridColumn
              span={['12/12', '12/12', '12/12', '12/12', '6/12']}
              offset={['0', '0', '0', '0', '1/12']}
            >
              <Hidden below="xl">
                <Logo width={130} solid={true} />
              </Hidden>
              <Box className={styles.textWrapper}>
                <Text color="white" variant="h1" marginTop={[0, 0, 0, 0, 4]}>
                  {slice.title}
                </Text>
              </Box>
              <Text
                color="white"
                variant="intro"
                fontWeight="regular"
                marginTop={4}
              >
                {slice.subtitle}
              </Text>
            </GridColumn>
            <GridColumn
              span={['12/12', '12/12', '12/12', '12/12', '3/12']}
              paddingTop={[0, 0, 0, 0, 6]}
            >
              <Box
                display="flex"
                justifyContent="flexEnd"
                marginTop={[4, 4, 4, 4, 30]}
              >
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
