import * as s from './RegulationDisplay.treat'

import React, { memo } from 'react'
import { HTMLText, PlainText, RegulationMaybeDiff } from './Regulations.types'
import { Accordion, AccordionItem, Box } from '@island.is/island-ui/core'
import { useDomid } from './regulationUtils'
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
  diffing?: boolean
}

export const Appendixes = memo((props: AppendixesProps) => {
  const { appendixes, diffing } = props

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
                labelVariant="h3"
                labelUse="h2"
                label={
                  diffing ? (
                    <HTMLDump
                      component="span"
                      className={s.bodyText}
                      html={appendix.title as HTMLText}
                    />
                  ) : (
                    appendix.title
                  )
                }
                startExpanded={hasDiff(appendix.text)}
              >
                <HTMLDump className={s.bodyText} html={appendix.text} />
              </AccordionItem>
            )
          )
        })}
      </Accordion>
    </Box>
  )
})
