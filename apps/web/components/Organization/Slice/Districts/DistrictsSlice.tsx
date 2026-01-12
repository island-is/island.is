import React from 'react'

import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Link,
  Text,
} from '@island.is/island-ui/core'
import { BorderAbove } from '@island.is/web/components'
import { Districts } from '@island.is/web/graphql/schema'

import * as styles from './DistrictsSlice.css'

interface SliceProps {
  slice: Districts
}

export const DistrictsSlice: React.FC<React.PropsWithChildren<SliceProps>> = ({
  slice,
}) => {
  return (
    !!slice.links.length && (
      <section
        key={slice.id}
        id={slice.id}
        aria-labelledby={'sliceTitle-' + slice.id}
      >
        {slice.hasBorderAbove && <BorderAbove />}
        <Box>
          <GridRow>
            <GridColumn span="12/12">
              <Text variant="h3" as="h2" id={'sliceTitle-' + slice.id}>
                {slice.title}
              </Text>
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn span={['10/10', '10/10', '10/10', '10/10', '5/10']}>
              {slice.description && (
                <Box paddingRight={[0, 0, 6]}>
                  <Text marginTop={3}>{slice.description}</Text>
                </Box>
              )}
              <Box
                component="ul"
                marginTop={5}
                marginBottom={5}
                className={styles.districtsList}
              >
                {slice.links.map((link, index) => (
                  <Box
                    component="li"
                    key={index}
                    marginBottom={4}
                    className={styles.districtsListItem}
                  >
                    <Link href={link.url}>
                      <Button variant="text" as="span">
                        {link.text}
                      </Button>
                    </Link>
                  </Box>
                ))}
              </Box>
            </GridColumn>
            {!!slice.image && (
              <GridColumn span={['10/10', '10/10', '10/10', '10/10', '5/10']}>
                {slice.image.url.split('.').pop() === 'svg' ? (
                  <object data={slice.image.url} type="image/svg+xml">
                    <img
                      src={slice.image.url}
                      alt={slice.image.description ?? ''}
                    />
                  </object>
                ) : (
                  <img
                    src={slice.image.url}
                    alt={slice.image.description ?? ''}
                  />
                )}
              </GridColumn>
            )}
          </GridRow>
        </Box>
      </section>
    )
  )
}
