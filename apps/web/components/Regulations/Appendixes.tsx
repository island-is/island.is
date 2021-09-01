import * as s from './RegulationDisplay.treat'

import React, { memo } from 'react'
import { HTMLText, useDomid } from '@island.is/regulations'
import { RegulationMaybeDiff } from '@island.is/regulations/web'
import { Accordion, AccordionItem, Box } from '@island.is/island-ui/core'
import { HTMLBox } from '@island.is/regulations/react'

const hasDiff = (text: string) => /<(?:del|ins)/.test(text)

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

          return (
            appendix.text && (
              <AccordionItem
                key={id}
                id={id}
                labelVariant="h3"
                labelUse="h2"
                label={
                  diffing ? (
                    <HTMLBox
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
                <HTMLBox className={s.bodyText} html={appendix.text} />
              </AccordionItem>
            )
          )
        })}
      </Accordion>
    </Box>
  )
})
