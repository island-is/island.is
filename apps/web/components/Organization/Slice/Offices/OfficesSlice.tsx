import React from 'react'
import {
  Organization,
  Districts,
  TwoColumnText,
  Offices,
} from '@island.is/web/graphql/schema'
import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
} from '@island.is/island-ui/core'
import * as styles from './OfficesSlice.treat'
import Link from 'next/link'
import Markdown from 'markdown-to-jsx'
import { OfficeCard } from "@island.is/web/components";

interface SliceProps {
  slice: Offices
}

export const OfficesSlice: React.FC<SliceProps> = ({ slice }) => {
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
            <h3 className={styles.title}>{slice.title}</h3>
            <GridContainer>
              <GridRow>
                {slice.offices.map((office) => (
                  <GridColumn
                    span={['12/12', '12/12', '12/12', '6/12']}
                    paddingBottom={[1, 1, 1]}
                  >
                    <OfficeCard
                      name={office.name}
                      address={office.address}
                      city={office.city}
                      openingHours={office.openingHours}
                    />
                  </GridColumn>
                ))}
              </GridRow>
            </GridContainer>
          </Box>
        </GridContainer>
      </section>
    </>
  )
}
