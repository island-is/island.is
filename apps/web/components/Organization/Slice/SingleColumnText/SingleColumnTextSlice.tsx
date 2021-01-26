import React from 'react'
import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import * as styles from './SingleColumnTextSlice.treat'
import Markdown from 'markdown-to-jsx'
import { SingleColumnText } from '@island.is/web/graphql/schema'
import Link from 'next/link'

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
                <h3 className={styles.singleColumnSliceTitle}>{slice.title}</h3>
                <div className={styles.singleColumnSliceContent}>
                  <Markdown>{slice.content}</Markdown>
                </div>
                {slice.link && (
                  <Link href="#">
                    <Button
                      icon="arrowForward"
                      iconType="filled"
                      type="button"
                      variant="text"
                    >
                      {slice.link.text}
                    </Button>
                  </Link>
                )}
              </GridColumn>
            </GridRow>
          </Box>
        </GridContainer>
      </section>
    </>
  )
}

export default SingleColumnTextSlice
