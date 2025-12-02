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
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { Item } from './FieldsRepeaterItem'

interface Props extends FieldBaseProps {
  field: FieldsRepeaterField
}

export const FieldsRepeaterFormField = ({
  application,
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

  const { control, getValues, setValue } = useFormContext()
  const answers = getValues()
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

  const [numberOfItems, setNumberOfItems] = useState(
    Math.max(numberOfItemsInAnswers ?? 0, minRowsValue),
  )

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

  const items = Object.keys(rawItems).map((key) => {
    return {
      id: key,
      ...rawItems[key],
    }
  })

  const { formatMessage, lang: locale } = useLocale()

  const { remove } = useFieldArray({
    control: control,
    name: id,
  })

  const values = useWatch({ name: data.id, control: control })

  const handleNewItem = () => {
    setNumberOfItems(numberOfItems + 1)
  }

  const handleRemoveItem = () => {
    const items = getValueViaPath<Array<unknown>>(answers, id)

    if (numberOfItems > (numberOfItemsInAnswers || 0)) {
      setNumberOfItems(numberOfItems - 1)
    } else if (numberOfItems === numberOfItemsInAnswers) {
      setValue(id, items?.slice(0, -1))
      setNumberOfItems(numberOfItems - 1)
    } else if (
      numberOfItemsInAnswers &&
      numberOfItems < numberOfItemsInAnswers
    ) {
      const difference = numberOfItems - numberOfItemsInAnswers
      setValue(id, items?.slice(0, difference))
      setNumberOfItems(numberOfItems)
    }

    remove(numberOfItems - 1)
  }

  const repeaterFields = (index: number) => (
    <GridRow rowGap={[2, 2, 2, 3]}>
      {items.map((item) => (
        <Item
          key={`${id}[${index}].${item.id}`}
          application={updatedApplication}
          error={error}
          item={item}
          dataId={id}
          index={index}
          values={values}
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

  const showAddButton =
    typeof hideAddButton === 'function'
      ? !hideAddButton(updatedApplication)
      : !hideAddButton
  const showRemoveButton = !hideRemoveButton && numberOfItems > minRowsValue

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
        <Stack space={numberOfItems === 0 ? 0 : 4}>
          {showFormTitle && displayTitleAsAccordion && (
            <Accordion singleExpand={false}>
              {Array.from({ length: numberOfItems }).map((_i, i) => {
                if (!shouldShowItem(i)) return null

                return (
                  <AccordionItem
                    id={`fields-repeater-form-title-accordion-${i}`}
                    key={i}
                    startExpanded={true}
                    label={
                      <Text variant={formTitleVariant}>
                        {formTitleNumbering === 'prefix' ? `${i + 1}. ` : ''}
                        {formTitle &&
                          formatTextWithLocale(
                            typeof formTitle === 'function'
                              ? formTitle(i, updatedApplication)
                              : formTitle,
                            application,
                            locale as Locale,
                            formatMessage,
                          )}
                        {formTitleNumbering === 'suffix' ? ` ${i + 1}` : ''}
                      </Text>
                    }
                  >
                    {repeaterFields(i)}
                  </AccordionItem>
                )
              })}
            </Accordion>
          )}

          {showFormTitle && !displayTitleAsAccordion && (
            <GridRow rowGap={[2, 2, 2, 3]}>
              {Array.from({ length: numberOfItems }).map((_i, i) => {
                if (!shouldShowItem(i)) return null

                return (
                  <Fragment key={i}>
                    <Box
                      marginTop={i === 0 ? 0 : 4}
                      marginLeft={2}
                      width="full"
                    >
                      <Text variant={formTitleVariant}>
                        {formTitleNumbering === 'prefix' ? `${i + 1}. ` : ''}
                        {formTitle &&
                          formatTextWithLocale(
                            typeof formTitle === 'function'
                              ? formTitle(i, updatedApplication)
                              : formTitle,
                            application,
                            locale as Locale,
                            formatMessage,
                          )}
                        {formTitleNumbering === 'suffix' ? ` ${i + 1}` : ''}
                      </Text>
                    </Box>
                    <GridColumn>{repeaterFields(i)}</GridColumn>
                  </Fragment>
                )
              })}
            </GridRow>
          )}

          {!showFormTitle &&
            Array.from({ length: numberOfItems }).map((_i, i) => {
              if (!shouldShowItem(i)) return null

              return <Fragment key={i}>{repeaterFields(i)}</Fragment>
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
                  disabled={!!maxRowsValue && numberOfItems >= maxRowsValue}
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
