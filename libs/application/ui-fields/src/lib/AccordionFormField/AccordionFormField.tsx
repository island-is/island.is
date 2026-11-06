import {
  AccordionField,
  AccordionItem as AccordionItemType,
  FieldBaseProps,
  FieldTypes,
  FormValue,
  RecordObject,
} from '@island.is/application/types'
import {
  Accordion,
  AccordionItem,
  Box,
  GridColumn,
  GridRow,
  Tag,
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
import { useEffect, useMemo, useRef, useState } from 'react'
import { useFormState, useWatch } from 'react-hook-form'

interface Props extends FieldBaseProps {
  field: AccordionField
}

const getErrorPaths = (errors: unknown, prefix = ''): string[] => {
  if (!errors) return []
  if (typeof errors === 'string') return prefix ? [prefix] : []
  if (typeof errors !== 'object') return []
  if (typeof (errors as { message?: unknown }).message === 'string') {
    return prefix ? [prefix] : []
  }
  return Object.entries(errors as RecordObject).flatMap(([key, value]) =>
    getErrorPaths(value, prefix ? `${prefix}.${key}` : key),
  )
}

const normalizePath = (path: string) => path.replace(/\[(\d+)\]/g, '.$1')

const pathsOverlap = (fieldId: string, errorPath: string) =>
  fieldId === errorPath ||
  errorPath.startsWith(`${fieldId}.`) ||
  fieldId.startsWith(`${errorPath}.`)

const getInitialExpanded = (
  items: Array<AccordionItemType>,
  isSingleExpand: boolean,
) => {
  if (!isSingleExpand) return items.map((item) => !!item.startExpanded)
  const lastStartExpanded = items
    .map((item) => !!item.startExpanded)
    .lastIndexOf(true)
  return items.map((_, index) => index === lastStartExpanded)
}

export const AccordionFormField = ({
  field,
  application,
  answerQuestions,
  renderField,
  errors,
}: Props) => {
  const [items, setItems] = useState<Array<AccordionItemType>>()
  const [expandedItems, setExpandedItems] = useState<boolean[]>([])
  const { formatMessage, lang: locale } = useLocale()
  const user = useUserInfo()
  const {
    accordionItems,
    marginBottom,
    marginTop,
    title,
    titleVariant,
    singleExpand,
  } = field
  const isSingleExpand = singleExpand ?? true
  const formValues = useWatch({ defaultValue: application.answers })
  const { submitCount } = useFormState()
  const prevVisibilityRef = useRef<Record<string, boolean>>({})
  const handledSubmitCountRef = useRef(submitCount)

  useEffect(() => {
    const resolvedItems =
      typeof accordionItems === 'function'
        ? accordionItems(application)
        : accordionItems
    setItems(resolvedItems)
    setExpandedItems(getInitialExpanded(resolvedItems, isSingleExpand))
  }, [accordionItems])

  const erroredItemIndices = useMemo(() => {
    if (!items) return []
    const errorPaths = getErrorPaths(errors)
    if (errorPaths.length === 0) return []

    const mergedValues = {
      ...application.answers,
      ...formValues,
    } as FormValue

    return items.flatMap((item, index) => {
      const hasError = (item.children ?? []).some((child) => {
        if (
          !shouldShowFormItem(
            child,
            mergedValues,
            application.externalData,
            null,
          )
        ) {
          return false
        }
        const childId = normalizePath(
          resolveFieldId(child, application, undefined),
        )
        return errorPaths.some((errorPath) =>
          pathsOverlap(childId, normalizePath(errorPath)),
        )
      })
      return hasError ? [index] : []
    })
  }, [items, errors, formValues, application])

  // Expand all items containing invalid fields each time the user tries to submit.
  // In single-expand mode this temporarily allows multiple open items; the
  // single-expand rule is restored on the next manual toggle.
  useEffect(() => {
    if (submitCount === handledSubmitCountRef.current) return
    handledSubmitCountRef.current = submitCount
    if (erroredItemIndices.length === 0) return

    setExpandedItems((prev) =>
      prev.map(
        (expanded, index) =>
          erroredItemIndices.includes(index) || (!isSingleExpand && expanded),
      ),
    )
  }, [submitCount, erroredItemIndices, isSingleExpand])

  const handleToggle = (index: number, expanded: boolean) => {
    setExpandedItems((prev) =>
      prev.map((value, i) => {
        if (i === index) return expanded
        return isSingleExpand && expanded ? false : value
      }),
    )
  }

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
          const resolvedId = resolveFieldId(child, application, undefined)
          newVisibility[resolvedId] = isVisible

          if (
            prevVisibilityRef.current[resolvedId] !== undefined &&
            prevVisibilityRef.current[resolvedId] !== isVisible
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
      {/* Single-expand is handled here so items can be expanded programmatically */}
      <Accordion singleExpand={false}>
        {items.map((item, index) => {
          const hasContent = !!item.itemContent
          const hasChildren = item.children && item.children.length > 0
          const liveApplication = {
            ...application,
            answers: {
              ...application.answers,
              ...formValues,
            } as FormValue,
          }
          const resolvedTag =
            typeof item.tag === 'function'
              ? item.tag(liveApplication)
              : item.tag
          const label = (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="spaceBetween"
              width="full"
            >
              <Text variant="h4" as="span">
                {formatText(item.itemTitle, application, formatMessage)}
              </Text>
              <Box marginRight={2} role="status" aria-live="polite">
                {resolvedTag && (
                  <Tag
                    variant={resolvedTag.variant ?? 'red'}
                    outlined={resolvedTag.outlined}
                    disabled
                  >
                    {formatText(
                      resolvedTag.label,
                      liveApplication,
                      formatMessage,
                    )}
                  </Tag>
                )}
              </Box>
            </Box>
          )
          return (
            <AccordionItem
              key={`accordion-item-${index}`}
              id={`accordion-item-${index}`}
              label={label}
              expanded={!!expandedItems[index]}
              onToggle={(expanded) => handleToggle(index, expanded)}
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
                      const resolvedId = resolveFieldId(
                        childField,
                        application,
                        undefined,
                      )
                      return (
                        <GridColumn
                          key={resolvedId}
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
