import React, { memo, useEffect, useState } from 'react'

import { Accordion, AccordionItem, Box } from '@island.is/island-ui/core'
import { OfficialJournalOfIcelandAdvertAppendix } from '@island.is/web/graphql/schema'

import * as s from './OJOIAdvertDisplay.css'

export type AppendixesProps = {
  additions?: OfficialJournalOfIcelandAdvertAppendix[]
}

export const Appendixes = memo((props: AppendixesProps) => {
  const [clonedContent, setClonedContent] = useState<string | null>(null)

  useEffect(() => {
    const wrapper = document.querySelector('.ojoi-advert-display-wrapper')
    if (!wrapper) return

    const lastElement = wrapper.lastElementChild

    if (
      lastElement &&
      lastElement.tagName === 'P' &&
      (lastElement.textContent?.includes('Útgáfud.:') ||
        lastElement.textContent?.includes('Útgáfudagur:'))
    ) {
      const clonedText = lastElement.textContent
      wrapper.removeChild(lastElement)
      setClonedContent(clonedText)
    }
  }, [])

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
      {clonedContent && (
        <Box className={s.bodyText} marginTop={3}>
          <p className={s.departmentDate}>
            <strong>{clonedContent}</strong>
          </p>
        </Box>
      )}
    </Box>
  )
})
