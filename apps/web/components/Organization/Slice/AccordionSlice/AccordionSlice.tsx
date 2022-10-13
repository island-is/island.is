import React from 'react'
import {
  Accordion,
  AccordionCard,
  AccordionItem,
  ActionCard,
  Box,
  BoxProps,
  Text,
} from '@island.is/island-ui/core'
import {
  AccordionSlice as AccordionSliceSchema,
  Html,
} from '@island.is/web/graphql/schema'
import { richText, SliceType } from '@island.is/island-ui/contentful'
import * as styles from './AccordionSlice.css'

interface SliceProps {
  slice: AccordionSliceSchema
}

export const AccordionSlice: React.FC<SliceProps> = ({ slice }) => {
  const labelId = 'sliceTitle-' + slice.id

  const borderProps: BoxProps = slice.hasBorderAbove
    ? {
        borderTopWidth: 'standard',
        borderColor: 'standard',
        paddingTop: [4, 4, 6],
        paddingBottom: [4, 4, 6],
      }
    : {
        paddingTop: 3,
        paddingBottom: 3,
      }

  return (
    <section key={slice.id} id={slice.id} aria-labelledby={labelId}>
      <Box {...borderProps}>
        <Text variant="h2" as="h2" marginBottom={2} id={labelId}>
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
          slice.accordionItems.map((item, index) => (
            <Box marginTop={index ? 4 : 0} key={item.id}>
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
                    !!item.link?.url &&
                    window.open(
                      item.link.url,
                      item.link.url.includes('://') ? '_blank' : '_self',
                    ),
                }}
              />
            </Box>
          ))}
      </Box>
    </section>
  )
}
