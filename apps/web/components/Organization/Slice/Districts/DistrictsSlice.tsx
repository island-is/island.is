import React from 'react'
import { Districts, Organization } from '@island.is/web/graphql/schema'
import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import * as styles from './DistrictsSlice.treat'
import Link from 'next/link'

interface SliceProps {
  slice: Districts
  organization?: Organization
}

export const DistrictsSlice: React.FC<SliceProps> = ({
  organization,
  slice,
}) => {
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
                {slice.links.map((link) => (
                  <li className={styles.districtsListItem}>
                    <Link href={link.url}>
                      <a>
                        <Button variant="text">{link.text}</Button>
                      </a>
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
