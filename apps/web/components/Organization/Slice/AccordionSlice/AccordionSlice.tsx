import React from 'react'
import {
  Accordion,
  AccordionCard,
  AccordionItem,
  ActionCard,
  Box,
  Text,
} from '@island.is/island-ui/core'
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
        {slice.type === 'accordion' &&
          slice.accordionItems.map((item) => (
            <Box paddingY={1} key={item.id}>
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
        {slice.type === 'accordion_minimal' && (
          <Box paddingTop={4}>
            <Accordion>
              {slice.accordionItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  id={item.id}
                  label={item.title}
                  startExpanded={slice.accordionItems.length === 1}
                >
                  <Text>{richText(item.content as SliceType[])}</Text>
                </AccordionItem>
              ))}
            </Accordion>
          </Box>
        )}
        {slice.type === 'CTA' &&
          slice.accordionItems.map((item) => (
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
                  onClick: () =>
                    !!item.link && window.open(item.link?.url, '_blank'),
                }}
              />
            </Box>
          ))}
      </Box>
    </section>
  )
}
