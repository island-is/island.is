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

const TwoColumnTextSlice: React.FC<SliceProps> = ({ slice }) => {
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
                <Markdown
                  className={styles.twoColumnSliceContent}
                  options={{
                    overrides: {
                      p: {
                        component: 'p',
                        props: { className: styles.twoColumnSliceParagraph },
                      },
                    },
                  }}
                >
                  {slice.leftContent}
                </Markdown>
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <h3 className={styles.twoColumnSliceTitle}>
                  {slice.rightTitle}
                </h3>
                <Markdown
                  className={styles.twoColumnSliceContent}
                  options={{
                    overrides: {
                      p: {
                        component: 'p',
                        props: { className: styles.twoColumnSliceParagraph },
                      },
                    },
                  }}
                >
                  {slice.rightContent}
                </Markdown>
              </GridColumn>
            </GridRow>
          </Box>
        </GridContainer>
      </section>
    </>
  )
}

export default TwoColumnTextSlice
