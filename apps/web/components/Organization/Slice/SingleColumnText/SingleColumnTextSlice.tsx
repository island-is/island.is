import React from 'react'
import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
} from '@island.is/island-ui/core'
import * as styles from './SingleColumnTextSlice.treat'
import Markdown from 'markdown-to-jsx'
import {SingleColumnText} from "@island.is/web/graphql/schema";

interface SliceProps {
  slice: SingleColumnText
}

export const SingleColumnTextSlice: React.FC<SliceProps> = ({ slice }) => {
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
              <GridColumn span={['12/12', '12/12', '12/12']}>
                <h3 className={styles.singleColumnSliceTitle}>
                  {slice.title}
                </h3>
                <Markdown
                  className={styles.singleColumnSliceContent}
                  options={{
                    overrides: {
                      p: {
                        component: 'p',
                        props: { className: styles.singleColumnSliceParagraph },
                      },
                    },
                  }}
                >
                  {slice.content}
                </Markdown>
              </GridColumn>
            </GridRow>
          </Box>
        </GridContainer>
      </section>
    </>
  )
}

export default SingleColumnTextSlice
