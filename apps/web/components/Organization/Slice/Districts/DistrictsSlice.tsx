import React from 'react'
import { Districts } from '@island.is/web/graphql/schema'
import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Link,
  Text,
} from '@island.is/island-ui/core'
import * as styles from './DistrictsSlice.treat'

interface SliceProps {
  slice: Districts
}

export const DistrictsSlice: React.FC<SliceProps> = ({ slice }) => {
  return (
    <section key={slice.id} aria-labelledby={'sliceTitle-' + slice.id}>
      <GridContainer>
        <Box
          borderTopWidth="standard"
          borderColor="standard"
          paddingTop={[8, 6, 15]}
          paddingBottom={[4, 5, 10]}
        >
          <Text variant="h3" as="h2">
            {slice.title}
          </Text>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '7/12']}>
              <ul className={styles.districtsList}>
                {slice.links.map((link, index) => (
                  <li className={styles.districtsListItem} key={index}>
                    <Link href={link.url}>
                      <Button variant="text">{link.text}</Button>
                    </Link>
                  </li>
                ))}
              </ul>
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '5/12']}>
              <img src={slice.image.url} alt="" />
            </GridColumn>
          </GridRow>
        </Box>
      </GridContainer>
    </section>
  )
}
