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
import { formatText, formatTextWithLocale } from '@island.is/application/core'
import { Markdown } from '@island.is/shared/components'
import { useEffect, useState, useMemo } from 'react'
import { useWatch } from 'react-hook-form'
import { useUserInfo } from '@island.is/react-spa/bff'

const IGNORED_HALF_TYPES: FieldTypes[] = [FieldTypes.RADIO, FieldTypes.CHECKBOX]
interface Props extends FieldBaseProps {
  field: AccordionField
}
export const AccordionFormField = ({
  field,
  application,
  answerQuestions: _answerQuestions,
  renderField,
}: Props) => {
  const [items, setItems] = useState<Array<AccordionItemType>>()
  const { formatMessage, lang: locale } = useLocale()
  const { accordionItems, marginBottom, marginTop, title, titleVariant } = field

  // Watch form values for dynamic condition updates
  const formData = useWatch({ defaultValue: application.answers }) as FormValue
  const user = useUserInfo()

  // Update application with latest answers for consistent state
  const currentApplication = useMemo(
    () => ({
      ...application,
      answers: { ...application.answers, ...formData },
    }),
    [application, formData],
  )

  useEffect(() => {
    if (typeof accordionItems === 'function') {
      // Re-evaluate accordion items when form data changes
      const newItems = accordionItems(currentApplication)
      setItems(newItems)
    } else {
      setItems(accordionItems)
    }
  }, [accordionItems, currentApplication, user])
  if (!items || items.length === 0) {
    return null
  }
  return (
    <Box marginTop={marginTop} marginBottom={marginBottom}>
      {title && (
        <Box marginBottom={1}>
          <Text variant={titleVariant ?? 'h3'}>
            {formatTextWithLocale(title, currentApplication, locale, formatMessage)}
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
              label={formatText(item.itemTitle, currentApplication, formatMessage)}
            >
              {hasContent && item.itemContent && (
                <Markdown>
                  {formatText(item.itemContent, currentApplication, formatMessage)}
                </Markdown>
              )}
              {hasChildren && item.children ? (
                <GridRow marginTop={hasContent ? 2 : 0}>
                  {(item.children as NonNullable<typeof item.children>).map(
                    (childField, childIndex) => {
                      const rendered = renderField?.(childField)
                      const isHalfColumn =
                        !IGNORED_HALF_TYPES.includes(childField.type) &&
                        childField?.width === 'half'
                      const span = isHalfColumn ? '1/2' : '1/1'
                      const isLastChild =
                        childIndex ===
                        (item.children as NonNullable<typeof item.children>)
                          .length -
                          1
                      const paddingBottom = isLastChild ? 0 : 2
                      if (!rendered) return null
                      return (
                        <GridColumn
                          key={childField.id || index}
                          span={
                            childField?.colSpan
                              ? childField?.colSpan
                              : ['1/1', '1/1', '1/1', span]
                          }
                          paddingBottom={paddingBottom}
                        >
                          <Box>{rendered}</Box>
                        </GridColumn>
                      )
                    },
                  )}
                </GridRow>
              ) : null}
            </AccordionItem>
          )
        })}
      </Accordion>
    </Box>
  )
}
