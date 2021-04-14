import * as s from './RegulationDisplay.treat'

import React, { FC, memo } from 'react'
import { HTMLText, PlainText, RegulationMaybeDiff } from './Regulations.types'
import { Accordion, AccordionItem, Box, Text } from '@island.is/island-ui/core'
import { useDomid } from './regulationUtils'
import { NoChildren } from '@island.is/web/types'
import { HTMLDump } from './HTMLDump'

const hasDiff = (text: string) => /<(del|ins)/.test(text)

const getSafeTitle = (title: string) =>
  hasDiff(title)
    ? {
        asPlainText: undefined,
        asHtml: title as HTMLText,
      }
    : {
        asPlainText: title
          .replace(/&gt;/g, '>')
          .replace(/&lt;/g, '<') as PlainText,
        asHtml: undefined,
      }

// ---------------------------------------------------------------------------

export type AppendixesProps = {
  legend: string
  genericTitle: string
  appendixes: ReadonlyArray<RegulationMaybeDiff['appendixes'][0]>
}

export const Appendixes: FC<AppendixesProps & NoChildren> = memo((props) => {
  const { appendixes } = props
  const domid = useDomid()

  if (!appendixes.length) {
    return null
  }

  return (
    <Box marginTop={[6, 10]} marginBottom={[6, 6]} aria-label={props.legend}>
      <Accordion singleExpand={false}>
        {appendixes.map((appendix, i) => {
          const id = 'appendix' + i + domid
          const title = getSafeTitle(appendix.title)

          return (
            appendix.text && (
              <AccordionItem
                key={id}
                id={id}
                label={title.asPlainText || props.genericTitle}
                labelUse="h2"
                visibleContent={
                  title.asHtml && (
                    <HTMLDump className={s.bodyText} content={title.asHtml} />
                  )
                }
                startExpanded={hasDiff(appendix.text)}
              >
                <HTMLDump className={s.bodyText} content={appendix.text} />
              </AccordionItem>
            )
          )
        })}
      </Accordion>
    </Box>
  )
})
