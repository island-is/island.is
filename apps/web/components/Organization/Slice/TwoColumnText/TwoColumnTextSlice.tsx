import React from 'react'
import { TwoColumnText } from '@island.is/web/graphql/schema'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import * as styles from './TwoColumnTextSlice.treat'
import Markdown from 'markdown-to-jsx'

interface SliceProps {
  slice: TwoColumnText
}

export const TwoColumnTextSlice: React.FC<SliceProps> = ({ slice }) => {
  return (
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
              <Text variant="h3" as="h2" id={'sliceTitle-' + slice.id}>
                {slice.leftTitle}
              </Text>
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '6/12']}>
              {slice.rightTitle && (
                <Text variant="h3" as="h2">
                  {slice.rightTitle}
                </Text>
              )}
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '6/12']}>
              <div className={styles.twoColumnSliceContent}>
                <Markdown>{slice.leftContent}</Markdown>
              </div>
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '6/12']}>
              <div className={styles.twoColumnSliceContent}>
                <Markdown>{slice.rightContent}</Markdown>
              </div>
            </GridColumn>
          </GridRow>
        </Box>
      </GridContainer>
    </section>
  )
}
