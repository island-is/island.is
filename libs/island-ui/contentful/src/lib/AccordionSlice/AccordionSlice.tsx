import React from 'react'
import { AccordionCard, Box, Text } from '@island.is/island-ui/core'
import * as styles from './AccordionSlice.treat'
import { richText, SliceType } from '@island.is/island-ui/contentful'
import { OneColumnTextProps } from '../OneColumnText/OneColumnText'
import slugify from '@sindresorhus/slugify'

export interface AccordionSliceProps {
  title: string
  accordionItems: OneColumnTextProps[]
}

export const AccordionSlice: React.FC<AccordionSliceProps> = ({
  title,
  accordionItems,
}) => {
  return (
    <Box>
      <Text variant="h3" as="h2" marginBottom={2}>
        {title}
      </Text>
      {accordionItems.map((item) => (
        <Box paddingY={1} key={slugify(item.title)}>
          <AccordionCard
            id={slugify(item.title)}
            label={item.title}
            startExpanded={accordionItems.length === 1}
          >
            <Box className={styles.accordionBox}>
              {richText(item.content as SliceType[])}
            </Box>
          </AccordionCard>
        </Box>
      ))}
    </Box>
  )
}
