import { useEffect, useState } from 'react'
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
  AlertMessage,
  Box,
  Button,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldDescription } from '@island.is/shared/form-fields'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { Item } from './FieldsRepeaterItem'
import { Locale } from '@island.is/shared/types'

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
    title,
    titleVariant = 'h4',
    removeItemButtonText = coreMessages.buttonRemove,
    addItemButtonText = coreMessages.buttonAdd,
    maxRows,
  } = data

  const { control, getValues, setValue } = useFormContext()
  const answers = getValues()
  const numberOfItemsInAnswers = getValueViaPath<Array<any>>(
    answers,
    id,
  )?.length
  const [numberOfItems, setNumberOfItems] = useState(
    numberOfItemsInAnswers || 1,
  )
  const [updatedApplication, setUpdatedApplication] = useState(application)

  useEffect(() => {
    setUpdatedApplication({
      ...application,
      answers: { ...answers },
    })
  }, [answers])

  const items = Object.keys(rawItems).map((key) => ({
    id: key,
    ...rawItems[key],
  }))

  const { formatMessage, lang: locale } = useLocale()

  const [activeIndex, setActiveIndex] = useState(-1)
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: id,
  })

  const values = useWatch({ name: data.id, control: control })
  const savedFields = fields.filter((_, index) => index !== activeIndex)
  const canAddItem = maxRows ? savedFields.length < maxRows : true

  const handleNewItem = () => {
    console.log(answers)

    setNumberOfItems(numberOfItems + 1)
  }

  const handleRemoveItem = () => {
    console.log('NumberOfItems: ', numberOfItems)
    console.log('NumberOfItemsInAnswer: ', numberOfItemsInAnswers)
    console.log(answers)

    if (numberOfItems > (numberOfItemsInAnswers || 0)) {
      setNumberOfItems(numberOfItems - 1)
    } else if (numberOfItems === numberOfItemsInAnswers) {
      setValue(id, answers[id].slice(0, -1))
      setNumberOfItems(numberOfItems - 1)
    } else if (
      numberOfItemsInAnswers &&
      numberOfItems < numberOfItemsInAnswers
    ) {
      const difference = numberOfItems - numberOfItemsInAnswers
      setValue(id, answers[id].slice(0, difference))
      setNumberOfItems(numberOfItems)
    }
  }

  const repeaterFields = (index: number) =>
    items.map((item) => (
      <Item
        key={`${id}[${activeIndex}].${item.id}.${index}`}
        application={updatedApplication}
        error={error}
        item={item}
        dataId={id}
        index={index}
        values={values}
      />
    ))

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
        <Stack space={4}>
          <GridRow rowGap={[2, 2, 2, 3]}>
            {Array.from({ length: numberOfItems }).map((_i, i) =>
              repeaterFields(i),
            )}
          </GridRow>
          <Box display="flex" justifyContent="flexEnd">
            {numberOfItems > 1 && (
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
            <Button
              variant="ghost"
              type="button"
              onClick={handleNewItem}
              icon="add"
              disabled={!canAddItem}
            >
              {formatText(addItemButtonText, updatedApplication, formatMessage)}
            </Button>
          </Box>
        </Stack>
        {error && typeof error === 'string' && fields.length === 0 && (
          <Box marginTop={3}>
            <AlertMessage type="error" title={error} />
          </Box>
        )}
      </Box>
    </Box>
  )
}
