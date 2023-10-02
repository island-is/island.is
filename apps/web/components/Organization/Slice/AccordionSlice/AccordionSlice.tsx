import React from 'react'
import { useRouter } from 'next/router'
import {
  Accordion,
  AccordionCard,
  AccordionItem,
  ActionCard,
  Box,
  BoxProps,
  Text,
} from '@island.is/island-ui/core'
import { shouldLinkOpenInNewWindow } from '@island.is/shared/utils'
import {
  AccordionSlice as AccordionSliceSchema,
  Html,
} from '@island.is/web/graphql/schema'
import { SliceType } from '@island.is/island-ui/contentful'
import { webRichText } from '@island.is/web/utils/richText'

const headingLevels = ['h2', 'h3', 'h4', 'h5'] as const
type HeadingType = typeof headingLevels[number]

export const extractHeadingLevels = (slice: AccordionSliceSchema) => {
  let titleHeading: HeadingType = 'h2'
  let childHeading: HeadingType = 'h3'

  if (headingLevels.includes(slice.titleHeadingLevel as HeadingType)) {
    titleHeading = slice.titleHeadingLevel as HeadingType
    childHeading = `h${Number(titleHeading[1]) + 1}` as HeadingType
  }

  return { titleHeading, childHeading }
}

interface SliceProps {
  slice: AccordionSliceSchema
}

export const AccordionSlice: React.FC<React.PropsWithChildren<SliceProps>> = ({
  slice,
}) => {
  const router = useRouter()
  const labelId = 'sliceTitle-' + slice.id

  const borderProps: BoxProps = slice.hasBorderAbove
    ? {
        borderTopWidth: 'standard',
        borderColor: 'standard',
        paddingTop: [4, 4, 6],
        paddingBottom: [4, 4, 6],
      }
    : {
        paddingTop: 2,
        paddingBottom: 2,
      }

  const { titleHeading, childHeading } = extractHeadingLevels(slice)

  return (
    <section key={slice.id} id={slice.id} aria-labelledby={labelId}>
      <Box {...borderProps}>
        {slice.showTitle && (
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
            <Accordion>
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
                  (item.content?.[0] as Html)?.document?.content[0]?.content[0]
                    ?.value
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
      </Box>
    </section>
  )
}
