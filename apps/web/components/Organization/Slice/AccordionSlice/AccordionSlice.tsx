import React from 'react'
import {
  AccordionCard,
  Box,
  GridContainer,
  Text,
} from '@island.is/island-ui/core'
import { AccordionSlice as AccordionSliceSchema } from '@island.is/web/graphql/schema'
import * as styles from './AccordionSlice.treat'
import { richText, SliceType } from '@island.is/island-ui/contentful'

interface SliceProps {
  slice: AccordionSliceSchema
}

export const AccordionSlice: React.FC<SliceProps> = ({ slice }) => {
  return (
    <section key={slice.id} aria-labelledby={'sliceTitle-' + slice.id}>
      <Box
        borderTopWidth="standard"
        borderColor="standard"
        paddingTop={[4, 4, 6]}
        paddingBottom={[4, 4, 6]}
      >
        <Text variant="h3" as="h2" marginBottom={2}>
          {slice.title}
        </Text>
        {slice.accordionItems.map((item) => (
          <Box paddingY={1}>
            <AccordionCard
              id={item.id}
              label={item.title}
              startExpanded={slice.accordionItems.length === 1}
            >
              <Box className={styles.accordionBox}>
                {richText(item.content as SliceType[])}
              </Box>
            </AccordionCard>
          </Box>
        ))}
      </Box>
    </section>
  )
}
