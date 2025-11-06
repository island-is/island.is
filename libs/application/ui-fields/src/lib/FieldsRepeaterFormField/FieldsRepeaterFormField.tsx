import {
  coreMessages,
  formatText,
  formatTextWithLocale,
  getValueViaPath,
} from '@island.is/application/core'
import {
  FieldBaseProps,
  FieldsRepeaterField,
} from '@island.is/application/types'
import {
  Accordion,
  AccordionItem,
  AlertMessage,
  Box,
  Button,
  GridColumn,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldDescription } from '@island.is/shared/form-fields'
import { Locale } from '@island.is/shared/types'
import isEqual from 'lodash/isEqual'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { Item } from './FieldsRepeaterItem'
import { uuid } from 'uuidv4'

interface Props extends FieldBaseProps {
  field: FieldsRepeaterField
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FieldRepeaterItem = Record<string, any> & {
  isRemoved?: boolean
}
type FieldRepeaterForm = Record<string, FieldRepeaterItem[]>

export const FieldsRepeaterFormField = ({
  application,
  setBeforeSubmitCallback,
  setBeforeValidationCallback,
  field: data,
  showFieldName,
  error,
}: Props) => {
  const {
    id,
    fields: rawItems,
    description,
    marginTop = 6,
    marginBottom,
    title = '',
    titleVariant = 'h2',
    formTitle,
    formTitleVariant = 'h4',
    formTitleNumbering = 'suffix',
    removeItemButtonText = coreMessages.buttonRemove,
    addItemButtonText = coreMessages.buttonAdd,
    hideAddButton,
    hideRemoveButton,
    displayTitleAsAccordion,
    itemCondition,
    minRows = 1,
    maxRows,
  } = data

  const items = Object.keys(rawItems).map((key) => {
    return {
      id: key,
      ...rawItems[key],
    }
  })

  const methods = useFormContext<FieldRepeaterForm>()
  const { fields, remove, update, append } = useFieldArray({
    control: methods.control,
    name: id,
  })

  const [activeIndex, setActiveIndex] = useState(
    fields?.findIndex((x) => x?.isRemoved) ?? 0,
  )

  const answers = methods.getValues()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const numberOfItemsInAnswers = getValueViaPath<Array<any>>(
    answers,
    id,
  )?.length

  const [updatedApplication, setUpdatedApplication] = useState({
    ...application,
    answers: { ...application.answers, ...answers },
  })
  const stableApplication = useMemo(() => application, [application])
  const stableAnswers = useMemo(() => answers, [answers])

  const minRowsValue =
    typeof minRows === 'function'
      ? minRows(answers, application.externalData)
      : minRows
  const maxRowsValue =
    typeof maxRows === 'function'
      ? maxRows(answers, application.externalData)
      : maxRows

  // const [showRemoveButton, setShowRemoveButton] = useState(
  //   !hideRemoveButton &&
  //     fields.filter((x) => !x.isRemoved).length > Math.max(minRowsValue, 0),
  // )

  useEffect(() => {
    setUpdatedApplication((prev) => {
      if (
        isEqual(prev, {
          ...stableApplication,
          answers: { ...stableApplication.answers, ...stableAnswers },
        })
      ) {
        return prev
      }

      return { ...stableApplication, answers: stableAnswers }
    })
  }, [stableApplication, stableAnswers])

  const { formatMessage, lang: locale } = useLocale()

  const safeUpdate = (index: number, changes: Partial<FieldRepeaterItem>) => {
    const current = methods.getValues(`${data.id}.${index}`) || {}
    update(index, { ...current, ...changes })
  }

  const values = useWatch({ name: data.id, control: methods.control })

  const [numberOfItems, setNumberOfItems] = useState(
    Math.max(numberOfItemsInAnswers ?? 0, minRowsValue),
  )

  // const handleNewItem = () => {
  //   console.log('minRowsValue', minRowsValue)
  //   const fieldLengthBeforeAppend = fields.filter((x) => !x.isRemoved).length
  //   console.log('fieldLengthBeforeAppend', fieldLengthBeforeAppend)
  //   append({ isRemoved: false })
  //   setActiveIndex(fieldLengthBeforeAppend + 1)
  //   methods.clearErrors()
  //   // setShowRemoveButton(
  //   //   !hideRemoveButton &&
  //   //     fieldLengthBeforeAppend + 1 > Math.max(minRowsValue, 0),
  //   // )
  // }

  // useEffect(() => {
  //   console.log('fields', fields)
  // }, [fields])

  // const handleRemoveItem = () => {
  //   const indexOfLastNonRemovedItem = fields
  //     .map((i) => i.isRemoved)
  //     .lastIndexOf(false)
  //   console.log('fields.length', fields.length)
  //   safeUpdate(indexOfLastNonRemovedItem, { isRemoved: true })
  //   // setShowRemoveButton(
  //   //   !hideRemoveButton &&
  //   //     fieldLengthBeforeUpdate - 1 > Math.max(minRowsValue, 0),
  //   // )
  // }

  const handleNewItem = () => {
    setNumberOfItems(numberOfItems + 1)
  }

  const handleRemoveItem = () => {
    const items = getValueViaPath<Array<unknown>>(answers, id)

    if (numberOfItems > (numberOfItemsInAnswers || 0)) {
      setNumberOfItems(numberOfItems - 1)
    } else if (numberOfItems === numberOfItemsInAnswers) {
      // setValue(id, items?.slice(0, -1))
      setNumberOfItems(numberOfItems - 1)
    } else if (
      numberOfItemsInAnswers &&
      numberOfItems < numberOfItemsInAnswers
    ) {
      const difference = numberOfItems - numberOfItemsInAnswers
      // setValue(id, items?.slice(0, difference))
      setNumberOfItems(numberOfItems)
    }

    remove(numberOfItems - 1)
  }

  const repeaterFields = (index: number, displayIndex: number) => (
    <GridRow rowGap={[2, 2, 2, 3]}>
      {items.map((item) => (
        <Item
          key={`${id}[${index}].${item.id}`}
          application={updatedApplication}
          error={error}
          item={item}
          dataId={id}
          index={index}
          displayIndex={displayIndex}
          values={values}
          locale={locale}
        />
      ))}
    </GridRow>
  )

  const showFormTitle = formTitleNumbering !== 'none' || formTitle

  const shouldShowItem = (index: number): boolean => {
    return itemCondition === undefined
      ? true
      : typeof itemCondition === 'function'
      ? itemCondition(index, updatedApplication)
      : itemCondition
  }

  // Keep activeIndex in a ref so setBeforeValidation callback always has latest value
  const activeIndexRef = useRef(activeIndex)
  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  // Register a beforeValidation callback that blocks form submission until the active registration is completed
  // Persist a unique callback ID across renders to avoid re-registering in setBeforeValidationCallback
  const callbackIdRef = useRef(`FieldRepeaterFormField-${uuid()}`)
  useEffect(() => {
    setBeforeSubmitCallback?.(
      async () => {
        // Remove deleted rows
        // Iterate in reverse so removing doesn't break indices
        for (let i = fields.length - 1; i >= 0; i--) {
          const row = fields[i]
          if (row.isRemoved) {
            remove(i)
          }
        }

        return [true, null]
      },
      { allowMultiple: true, customCallbackId: callbackIdRef.current },
    )
  }, [fields, remove, setBeforeSubmitCallback])

  // useEffect(() => {
  //   setBeforeValidationCallback?.(
  //     async () => {
  //       // Remove deleted rows
  //       // Iterate in reverse so removing doesn't break indices
  //       for (let i = fields.length - 1; i >= 0; i--) {
  //         const row = fields[i]
  //         if (row.isRemoved) {
  //           remove(i)
  //         }
  //       }

  //       return [true, null]
  //     },
  //     { allowMultiple: true, customCallbackId: callbackIdRef.current },
  //   )
  // }, [fields, remove, setBeforeValidationCallback])

  const showRemoveButton =
    fields.filter((x) => !x.isRemoved).length > Math.max(minRowsValue, 0) &&
    !hideRemoveButton

  const showAddButton =
    maxRowsValue &&
    fields.filter((x) => !x.isRemoved).length <= Math.max(maxRowsValue, 0) &&
    !hideAddButton

  return (
    <Box marginTop={marginTop} marginBottom={marginBottom}>
      {showFieldName && (
        <Text variant={titleVariant} marginBottom={2}>
          {formatTextWithLocale(
            title,
            application,
            locale as Locale,
            formatMessage,
          )}
        </Text>
      )}
      {description && (
        <FieldDescription
          description={formatTextWithLocale(
            description,
            updatedApplication,
            locale as Locale,
            formatMessage,
          )}
        />
      )}
      <Box marginTop={description ? 3 : 0}>
        <Stack
          space={
            fields.length === 0 ||
            fields.filter((x) => !x.isRemoved).length === 0
              ? 0
              : 4
          }
        >
          {showFormTitle && displayTitleAsAccordion && (
            <Accordion singleExpand={false}>
              {Array.from({
                length: Math.max(fields.length, minRowsValue),
              }).map((_i, i) => {
                if (!shouldShowItem(i)) return null

                if (fields[i]?.isRemoved) {
                  return null
                }

                // Compute display index (based only on visible rows)
                const displayIndex = Math.max(
                  fields
                    .filter((f) => !f.isRemoved)
                    .findIndex((f) => f.id === fields[i]?.id),
                  0,
                )

                return (
                  <AccordionItem
                    id={`fields-repeater-form-title-accordion-${i}`}
                    key={i}
                    startExpanded={true}
                    label={
                      <Text variant={formTitleVariant}>
                        {formTitleNumbering === 'prefix'
                          ? `${displayIndex + 1}. `
                          : ''}
                        {formTitle &&
                          formatTextWithLocale(
                            typeof formTitle === 'function'
                              ? formTitle(displayIndex, updatedApplication)
                              : formTitle,
                            application,
                            locale as Locale,
                            formatMessage,
                          )}
                        {formTitleNumbering === 'suffix'
                          ? ` ${displayIndex + 1}`
                          : ''}
                      </Text>
                    }
                  >
                    {repeaterFields(i, displayIndex)}
                  </AccordionItem>
                )
              })}
            </Accordion>
          )}

          {showFormTitle && !displayTitleAsAccordion && (
            <GridRow rowGap={[2, 2, 2, 3]}>
              {Array.from({
                length: Math.max(fields.length, minRowsValue),
              }).map((_i, i) => {
                if (!shouldShowItem(i)) return null
                if (fields[i]?.isRemoved) {
                  return null
                }

                // Compute display index (based only on visible rows)
                const displayIndex = Math.max(
                  fields
                    .filter((f) => !f.isRemoved)
                    .findIndex((f) => f.id === fields[i]?.id),
                  0,
                )

                return (
                  <Fragment key={i}>
                    <Box
                      marginTop={i === 0 ? 0 : 4}
                      marginLeft={2}
                      width="full"
                    >
                      <Text variant={formTitleVariant}>
                        {formTitleNumbering === 'prefix'
                          ? `${displayIndex + 1}. `
                          : ''}
                        {formTitle &&
                          formatTextWithLocale(
                            typeof formTitle === 'function'
                              ? formTitle(displayIndex, updatedApplication)
                              : formTitle,
                            application,
                            locale as Locale,
                            formatMessage,
                          )}
                        {formTitleNumbering === 'suffix'
                          ? ` ${displayIndex + 1}`
                          : ''}
                      </Text>
                    </Box>
                    <GridColumn>{repeaterFields(i, displayIndex)}</GridColumn>
                  </Fragment>
                )
              })}
            </GridRow>
          )}

          {!showFormTitle &&
            Array.from({
              length: Math.max(fields.length, minRowsValue),
            }).map((_i, i) => {
              if (!shouldShowItem(i)) return null
              if (fields[i]?.isRemoved) {
                return null
              }
              // Compute display index (based only on visible rows)
              const displayIndex = Math.max(
                fields
                  .filter((f) => !f.isRemoved)
                  .findIndex((f) => f.id === fields[i]?.id),
                0,
              )

              return (
                <Fragment key={i}>{repeaterFields(i, displayIndex)}</Fragment>
              )
            })}

          {(showRemoveButton || showAddButton) && (
            <Box display="flex" justifyContent="flexEnd">
              {showRemoveButton && (
                <Box marginRight={2}>
                  <Button
                    variant="ghost"
                    colorScheme="destructive"
                    type="button"
                    onClick={handleRemoveItem}
                  >
                    {formatText(
                      removeItemButtonText,
                      updatedApplication,
                      formatMessage,
                    )}
                  </Button>
                </Box>
              )}
              {showAddButton && (
                <Button
                  variant="ghost"
                  type="button"
                  onClick={handleNewItem}
                  icon="add"
                  disabled={
                    !!maxRowsValue &&
                    fields.filter((x) => !x.isRemoved).length >= maxRowsValue
                  }
                >
                  {formatText(
                    addItemButtonText,
                    updatedApplication,
                    formatMessage,
                  )}
                </Button>
              )}
            </Box>
          )}
        </Stack>
        {error && typeof error === 'string' && (
          <Box marginTop={3}>
            <AlertMessage type="error" title={error} />
          </Box>
        )}
      </Box>
    </Box>
  )
}
