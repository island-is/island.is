import {
  AccordionField,
  AccordionItem as AccordionItemType,
  FieldBaseProps,
  FieldTypes,
  FormValue,
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
import {
  formatText,
  formatTextWithLocale,
  resolveFieldId,
  shouldShowFormItem,
} from '@island.is/application/core'
import { useUserInfo } from '@island.is/react-spa/bff'
import { Markdown } from '@island.is/shared/components'
import { useEffect, useRef, useState } from 'react'
import { useWatch } from 'react-hook-form'

interface Props extends FieldBaseProps {
  field: AccordionField
}
export const AccordionFormField = ({
  field,
  application,
  answerQuestions,
  renderField,
}: Props) => {
  const [items, setItems] = useState<Array<AccordionItemType>>()
  const { formatMessage, lang: locale } = useLocale()
  const user = useUserInfo()
  const { accordionItems, marginBottom, marginTop, title, titleVariant } = field
  const formValues = useWatch({ defaultValue: application.answers })
  const prevVisibilityRef = useRef<Record<string, boolean>>({})

  useEffect(() => {
    if (typeof accordionItems === 'function') {
      setItems(accordionItems(application))
    } else {
      setItems(accordionItems)
    }
  }, [accordionItems])

  useEffect(() => {
    if (!items) return

    const mergedValues = {
      ...application.answers,
      ...formValues,
    } as FormValue

    let conditionChanged = false
    const newVisibility: Record<string, boolean> = {}

    for (const item of items) {
      if (item.children) {
        for (const child of item.children) {
          const isVisible = shouldShowFormItem(
            child,
            mergedValues,
            application.externalData,
            null,
          )
          newVisibility[child.id] = isVisible

          if (
            prevVisibilityRef.current[child.id] !== undefined &&
            prevVisibilityRef.current[child.id] !== isVisible
          ) {
            conditionChanged = true
          }
        }
      }
    }

    prevVisibilityRef.current = newVisibility

    if (conditionChanged && answerQuestions) {
      answerQuestions(formValues as FormValue)
    }
  }, [formValues, items, application, answerQuestions])
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
                  <GridRow>
                    {item.children!.map((childField) => {
                      const rendered = renderField?.(childField)
                      if (!rendered) return null
                      const isHalfColumn =
                        childField.type !== FieldTypes.RADIO &&
                        childField.type !== FieldTypes.CHECKBOX &&
                        childField.width === 'half'
                      const span = isHalfColumn ? '1/2' : '1/1'
                      return (
                        <GridColumn
                          key={childField.id}
                          span={['1/1', '1/1', '1/1', span]}
                          paddingBottom={2}
                        >
                          {rendered}
                        </GridColumn>
                      )
                    })}
                  </GridRow>
                </Box>
              )}
            </AccordionItem>
          )
        })}
      </Accordion>
    </Box>
  )
}
