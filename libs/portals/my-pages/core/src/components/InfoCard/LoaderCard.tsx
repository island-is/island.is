import {
  Box,
  GridColumn,
  GridRow,
  SkeletonLoader,
} from '@island.is/island-ui/core'
import React from 'react'
import * as styles from './InfoCard.css'

export const LoaderCard: React.FC = () => {
  return (
    <Box>
      <Box
        border="standard"
        borderColor="blue200"
        borderRadius="large"
        padding={3}
        height="full"
        overflow="hidden"
      >
        <GridRow direction="row">
          <GridColumn>
            <Box display="flex" justifyContent="spaceBetween" flexGrow={1}>
              <SkeletonLoader width={100} />
              <SkeletonLoader width={150} />
            </Box>

            <Box
              display="flex"
              flexDirection={['column', 'column', 'column', 'column', 'row']}
              flexWrap="nowrap"
              alignItems="stretch"
              justifyContent="spaceBetween"
              width="full"
            >
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="spaceBetween"
                className={styles.flexItem}
              >
                <SkeletonLoader width={100} />
                <SkeletonLoader width={150} />
              </Box>
            </Box>
          </GridColumn>
        </GridRow>
      </Box>
    </Box>
  )
}

export default LoaderCard
