import React, { memo } from 'react'

import { Accordion, AccordionItem, Box } from '@island.is/island-ui/core'
import { OfficialJournalOfIcelandAdvertAppendix } from '@island.is/web/graphql/schema'

import * as s from './OJOIAdvertDisplay.css'

export type AppendixesProps = {
  additions?: OfficialJournalOfIcelandAdvertAppendix[]
}

export const Appendixes = memo((props: AppendixesProps) => {
  const { additions } = props

  if (!additions || additions.length === 0) {
    return null
  }

  return (
    <Box marginTop={[6, 10]} marginBottom={[6, 6]}>
      <Accordion singleExpand={false}>
        {additions.map((appendix) => {
          const { id } = appendix
          return (
            appendix.html && (
              <div id={id} key={id}>
                <AccordionItem
                  id={id + '-internals'}
                  labelVariant="h4"
                  labelUse="h3"
                  label={appendix.title}
                >
                  <Box
                    className={s.bodyText}
                    dangerouslySetInnerHTML={{ __html: appendix.html }}
                  ></Box>
                </AccordionItem>
              </div>
            )
          )
        })}
      </Accordion>
    </Box>
  )
})
