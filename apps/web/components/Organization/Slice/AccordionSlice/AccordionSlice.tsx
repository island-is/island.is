import React from 'react'
import { AccordionCard, ActionCard, Box, Text } from '@island.is/island-ui/core'
import {
  AccordionSlice as AccordionSliceSchema,
  Html,
} from '@island.is/web/graphql/schema'
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
        <Text variant="h2" as="h2" marginBottom={2}>
          {slice.title}
        </Text>
        {slice.accordionItems.map((item) => (
          <Box paddingY={1}>
            {slice.type === 'accordion' && (
              <AccordionCard
                id={item.id}
                label={item.title}
                startExpanded={slice.accordionItems.length === 1}
              >
                <Box className={styles.accordionBox}>
                  {richText(item.content as SliceType[])}
                </Box>
              </AccordionCard>
            )}
            {slice.type === 'CTA' && (
              <Box>
                <ActionCard
                  heading={item.title}
                  text={
                    (item.content[0] as Html)?.document?.content[0]?.content[0]
                      ?.value
                  }
                  cta={{
                    label: item.link?.text ?? 'Default',
                    icon: 'arrowForward',
                  }}
                />
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </section>
  )
}
