import {
  AccordionField,
  AccordionItem as AccordionItemType,
  FieldBaseProps,
  FieldTypes,
} from '@island.is/application/types'
import {
  Accordion,
  AccordionItem,
  Box,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { formatText, formatTextWithLocale } from '@island.is/application/core'
import { Markdown } from '@island.is/shared/components'
import { useEffect, useState } from 'react'

const IGNORED_HALF_TYPES: FieldTypes[] = [FieldTypes.RADIO, FieldTypes.CHECKBOX]
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
                <GridRow marginTop={hasContent ? 2 : 0}>
                  {item.children!.map((childField) => {
                    const rendered = renderField?.(childField)
                    const isHalfColumn =
                      !IGNORED_HALF_TYPES.includes(childField.type) &&
                      childField?.width === 'half'
                    const span = isHalfColumn ? '1/2' : '1/1'
                    const isLastChild = index === item.children!.length - 1
                    const paddingBottom = isLastChild ? 0 : 2
                    if (!rendered) return null
                    return (
                      <GridColumn
                        key={field.id || index}
                        span={
                          field?.colSpan
                            ? field?.colSpan
                            : ['1/1', '1/1', '1/1', span]
                        }
                        paddingBottom={paddingBottom}
                      >
                        <Box>{rendered}</Box>
                      </GridColumn>
                    )
                  })}
                </GridRow>
              )}
            </AccordionItem>
          )
        })}
      </Accordion>
    </Box>
  )
}
