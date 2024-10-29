import {
  AccordionField,
  AccordionItem as AccordionItemType,
  FieldBaseProps,
} from '@island.is/application/types'
import { Accordion, AccordionItem, Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatText } from '@island.is/application/core'
import { Markdown } from '@island.is/shared/components'
import { useEffect, useState } from 'react'

interface Props extends FieldBaseProps {
  field: AccordionField
}

export const AccordionFormField = ({ field, application }: Props) => {
  const [items, setItems] = useState<Array<AccordionItemType>>()
  const { formatMessage } = useLocale()
  const { accordionItems, marginBottom, marginTop, title, titleVariant } = field

  useEffect(() => {
    if (typeof accordionItems === 'function') {
      setItems(accordionItems(application))
    } else {
      setItems(accordionItems)
    }
  }, [accordionItems])

  if (!items || items.length === 0) {
    return null
  }

  return (
    <Box marginTop={marginTop} marginBottom={marginBottom}>
      {title && (
        <Box marginBottom={1}>
          <Text variant={titleVariant ?? 'h3'}>
            {formatText(field.title, application, formatMessage)}
          </Text>
        </Box>
      )}
      <Accordion>
        {items.map((item, index) => {
          return (
            <AccordionItem
              key={`accordion-item-${index}`}
              id={`accordion-item-${index}`}
              label={formatText(item.itemTitle, application, formatMessage)}
            >
              <Markdown>
                {formatText(item.itemContent, application, formatMessage)}
              </Markdown>
            </AccordionItem>
          )
        })}
      </Accordion>
    </Box>
  )
}
