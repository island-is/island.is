import React from 'react'
import { useRouter } from 'next/router'

import { SliceType } from '@island.is/island-ui/contentful'
import {
  Accordion,
  AccordionCard,
  AccordionItem,
  ActionCard,
  Box,
  CategoryCard,
  Text,
} from '@island.is/island-ui/core'
import { shouldLinkOpenInNewWindow } from '@island.is/shared/utils'
import { BorderAbove } from '@island.is/web/components'
import {
  AccordionSlice as AccordionSliceSchema,
  Html,
} from '@island.is/web/graphql/schema'
import { extractHeadingLevels } from '@island.is/web/utils/navigation'
import { webRichText } from '@island.is/web/utils/richText'

interface SliceProps {
  slice: AccordionSliceSchema
}

export const AccordionSlice: React.FC<React.PropsWithChildren<SliceProps>> = ({
  slice,
}) => {
  const router = useRouter()
  const labelId = 'sliceTitle-' + slice.id

  const { titleHeading, childHeading } = extractHeadingLevels(slice)

  return (
    <section
      key={slice.id}
      id={slice.id}
      aria-labelledby={slice.showTitle && slice.title ? labelId : undefined}
    >
      {slice.hasBorderAbove && <BorderAbove />}
      <Box>
        {slice.showTitle && slice.title && (
          <Text variant="h2" as={titleHeading} marginBottom={2} id={labelId}>
            {slice.title}
          </Text>
        )}
        {slice.type === 'accordion' &&
          (slice.accordionItems ?? []).map((item) => (
            <Box paddingY={1} key={item.id}>
              <AccordionCard
                id={item.id}
                label={item.title}
                labelUse={childHeading}
                startExpanded={slice.accordionItems?.length === 1}
              >
                <Box>{webRichText(item.content ?? [])}</Box>
              </AccordionCard>
            </Box>
          ))}
        {slice.type === 'accordion_minimal' && (
          <Box paddingTop={4}>
            <Accordion singleExpand={false}>
              {(slice.accordionItems ?? []).map((item) => (
                <AccordionItem
                  key={item.id}
                  id={item.id}
                  label={item.title}
                  labelUse={childHeading}
                  startExpanded={slice.accordionItems?.length === 1}
                >
                  <Text>{webRichText(item.content as SliceType[])}</Text>
                </AccordionItem>
              ))}
            </Accordion>
          </Box>
        )}
        {slice.type === 'CTA' &&
          (slice.accordionItems ?? []).map((item, index) => (
            <Box marginTop={index ? 4 : 0} key={item.id}>
              <ActionCard
                heading={item.title}
                text={
                  (item.content?.[0] as Html)?.document?.content?.[0]
                    ?.content?.[0]?.value
                }
                cta={{
                  label: item.link?.text ?? 'Default',
                  icon: 'arrowForward',
                  onClick: () => {
                    if (!item.link?.url) return
                    const openInNewWindow = shouldLinkOpenInNewWindow(
                      item.link.url,
                    )
                    if (openInNewWindow) {
                      window.open(item.link.url, '_blank')
                    } else {
                      router.push(item.link.url)
                    }
                  },
                }}
              />
            </Box>
          ))}

        {slice.type === 'category_card' &&
          (slice.accordionItems ?? [])
            .filter((item) => Boolean(item.link?.url))
            .map((item, index) => {
              return (
                <Box marginTop={index ? 4 : 0} key={item.id}>
                  <CategoryCard
                    href={item.link?.url}
                    heading={item.title}
                    text={
                      (item.content?.[0] as Html)?.document?.content?.[0]
                        ?.content?.[0]?.value
                    }
                  />
                </Box>
              )
            })}
      </Box>
    </section>
  )
}
