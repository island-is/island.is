import React from 'react'
import {
  Organization,
  Districts,
  TwoColumnText,
} from '@island.is/web/graphql/schema'
import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
} from '@island.is/island-ui/core'
import * as styles from './TwoColumnTextSlice.treat'
import Link from 'next/link'
import Markdown from 'markdown-to-jsx'

interface SliceProps {
  slice: TwoColumnText
}

export const TwoColumnTextSlice: React.FC<SliceProps> = ({ slice }) => {
  return (
    <>
      <section key={slice.id} aria-labelledby={'sliceTitle-' + slice.id}>
        <GridContainer>
          <Box
            borderTopWidth="standard"
            borderColor="standard"
            paddingTop={[4, 4, 6]}
            paddingBottom={[4, 5, 10]}
          >
            <GridRow>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <h3 className={styles.twoColumnSliceTitle}>
                  {slice.leftTitle}
                </h3>
                <div className={styles.twoColumnSliceContent}>
                  <Markdown>{slice.leftContent}</Markdown>
                </div>
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <h3 className={styles.twoColumnSliceTitle}>
                  {slice.rightTitle}
                </h3>
                <div className={styles.twoColumnSliceContent}>
                  <Markdown>{slice.rightContent}</Markdown>
                </div>
              </GridColumn>
            </GridRow>
          </Box>
        </GridContainer>
      </section>
    </>
  )
}
