import {
  AccordionField,
  AccordionItem as AccordionItemType,
  FieldBaseProps,
} from '@island.is/application/types'
import { Accordion, AccordionItem, Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  formatText,
  formatTextWithLocale,
  resolveFieldId,
} from '@island.is/application/core'
import { useUserInfo } from '@island.is/react-spa/bff'
import { Markdown } from '@island.is/shared/components'
import { useEffect, useState } from 'react'

interface Props extends FieldBaseProps {
  field: AccordionField
}
export const AccordionFormField = ({
  field,
  application,
  renderField,
}: Props) => {
  const [items, setItems] = useState<Array<AccordionItemType>>()
  const { formatMessage, lang: locale } = useLocale()
  const user = useUserInfo()
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
            {formatTextWithLocale(title, application, locale, formatMessage)}
          </Text>
        </Box>
      )}
      <Accordion>
        {items.map((item, index) => {
          const hasContent = !!item.itemContent
          const hasChildren = item.children && item.children.length > 0
          return (
            <AccordionItem
              key={`accordion-item-${index}`}
              id={`accordion-item-${index}`}
              label={formatText(item.itemTitle, application, formatMessage)}
            >
              {hasContent && (
                <Markdown>
                  {formatText(item.itemContent!, application, formatMessage)}
                </Markdown>
              )}
              {hasChildren && (
                <Box
                  style={{ overflow: 'visible' }}
                  marginTop={hasContent ? 2 : 0}
                >
                  {item.children!.map((childField) => {
                    const rendered = renderField?.(childField)
                    if (!rendered) return null
                    const resolvedId = resolveFieldId(
                      childField,
                      application,
                      user,
                    )
                    return (
                      <Box key={resolvedId} marginBottom={2}>
                        {rendered}
                      </Box>
                    )
                  })}
                </Box>
              )}
            </AccordionItem>
          )
        })}
      </Accordion>
    </Box>
  )
}
