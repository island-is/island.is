import {
  coreMessages,
  formatText,
  formatTextWithLocale,
} from '@island.is/application/core'
import {
  FieldBaseProps,
  FieldsRepeaterField,
  TableRepeaterField,
} from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Button,
  GridRow,
  Icon,
  Stack,
  Table as T,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldDescription } from '@island.is/shared/form-fields'
import { FC, useState } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { handleCustomMappedValues } from './utils'
import { Item } from './FieldsRepeaterItem'
import { Locale } from '@island.is/shared/types'

interface Props extends FieldBaseProps {
  field: FieldsRepeaterField
}

export const TableRepeaterFormField: FC<Props> = ({
  application,
  field: data,
  showFieldName,
  error,
}) => {
  const {
    fields: rawItems,
    table,
    formTitle,
    description,
    marginTop = 6,
    marginBottom,
    title,
    titleVariant = 'h4',
    addItemButtonText = coreMessages.buttonAdd,
    saveItemButtonText = coreMessages.reviewButtonSubmit,
    maxRows,
  } = data

  const items = Object.keys(rawItems).map((key) => ({
    id: key,
    ...rawItems[key],
  }))

  const { formatMessage, lang: locale } = useLocale()
  const methods = useFormContext()
  const [activeIndex, setActiveIndex] = useState(-1)
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: data.id,
  })

  const values = useWatch({ name: data.id, control: methods.control })
  const activeField = activeIndex >= 0 ? fields[activeIndex] : null
  const savedFields = fields.filter((_, index) => index !== activeIndex)
  const tableItems = items.filter((x) => x.displayInTable !== false)
  const tableHeader = table?.header ?? tableItems.map((item) => item.label)
  const tableRows = table?.rows ?? tableItems.map((item) => item.id)
  const canAddItem = maxRows ? savedFields.length < maxRows : true

  // check for components that might need some custom value mapping
  const customMappedValues = handleCustomMappedValues(tableItems, values)

  const handleSaveItem = async (index: number) => {
    const isValid = await methods.trigger(`${data.id}[${index}]`, {
      shouldFocus: true,
    })

    if (isValid) {
      setActiveIndex(-1)
    }
  }

  const handleNewItem = () => {
    append({})
    setActiveIndex(fields.length)
    methods.clearErrors()
  }

  const handleRemoveItem = (index: number) => {
    if (activeIndex === index) setActiveIndex(-1)
    if (activeIndex > index) setActiveIndex(activeIndex - 1)
    remove(index)
  }

  const handleEditItem = (index: number) => {
    setActiveIndex(index)
  }

  const formatTableValue = (key: string, item: Record<string, string>) => {
    const formatFn = table?.format?.[key]
    const formatted = formatFn ? formatFn(item[key]) : item[key]
    return typeof formatted === 'string'
      ? formatted
      : formatText(formatted, application, formatMessage)
  }

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
            application,
            locale as Locale,
            formatMessage,
          )}
        />
      )}
      <Box marginTop={description ? 3 : 0}>
        <Stack space={4}>
          {activeField ? (
            <Stack space={2} key={activeField.id}>
              {formTitle && (
                <Text variant="h4">
                  {formatText(formTitle, application, formatMessage)}
                </Text>
              )}
              <GridRow rowGap={[2, 2, 2, 3]}>
                {items.map((item) => (
                  <Item
                    key={`${data.id}[${activeIndex}].${item.id}`}
                    application={application}
                    error={error}
                    item={item}
                    dataId={data.id}
                    activeIndex={activeIndex}
                    values={values}
                  />
                ))}
              </GridRow>
              <Box display="flex" justifyContent="flexEnd">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => handleSaveItem(activeIndex)}
                >
                  {formatText(saveItemButtonText, application, formatMessage)}
                </Button>
              </Box>
            </Stack>
          ) : (
            <Box display="flex" justifyContent="flexEnd">
              <Button
                variant="ghost"
                type="button"
                onClick={handleNewItem}
                icon="add"
                disabled={!canAddItem}
              >
                {formatText(addItemButtonText, application, formatMessage)}
              </Button>
            </Box>
          )}
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
