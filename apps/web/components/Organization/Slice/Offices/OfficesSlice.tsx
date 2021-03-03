import React from 'react'
import { Offices } from '@island.is/web/graphql/schema'
import {
  AccordionCard,
  Box,
  ContentBlock,
  GridContainer,
  Text,
} from '@island.is/island-ui/core'
import { richText, SliceType } from '@island.is/island-ui/contentful'
import * as styles from './OfficesSlice.treat'

interface SliceProps {
  slice: Offices
}

export const OfficesSlice: React.FC<SliceProps> = ({ slice }) => {
  return (
    <section key={slice.id} aria-labelledby={'sliceTitle-' + slice.id}>
      <GridContainer>
        <Box
          borderTopWidth="standard"
          borderColor="standard"
          paddingTop={[4, 4, 6]}
          paddingBottom={[4, 5, 10]}
        >
          <Text
            variant="h3"
            as="h2"
            marginBottom={2}
            id={'sliceTitle-' + slice.id}
          >
            {slice.title}
          </Text>
          <ContentBlock>
            {slice.offices.map((office, index) => (
              <Box paddingY={1}>
                <AccordionCard
                  id={office.id}
                  label={office.name}
                  startExpanded={slice.offices.length === 1}
                >
                  <Box className={styles.accordionBox}>
                    {richText(office.content as SliceType[])}
                  </Box>
                </AccordionCard>
              </Box>
            ))}
          </ContentBlock>
        </Box>
      </GridContainer>
    </section>
  )
}
