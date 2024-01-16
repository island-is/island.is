import { coreMessages, formatText } from '@island.is/application/core'
import {
  FieldBaseProps,
  TableRepeaterField,
} from '@island.is/application/types'
import {
  Stack,
  Box,
  Button,
  Table as T,
  Text,
  Icon,
  Tooltip,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  CheckboxController,
  DatePickerController,
  InputController,
  RadioController,
  SelectController,
} from '@island.is/shared/form-fields'
import { FC, useState } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'

interface Props extends FieldBaseProps {
  field: TableRepeaterField
}

const componentMapper = {
  input: InputController,
  select: SelectController,
  checkbox: CheckboxController,
  date: DatePickerController,
  radio: RadioController,
}

export const TableRepeaterFormField: FC<Props> = ({
  application,
  field: data,
  error,
}) => {
  const {
    fields: items,
    table,
    addItemButtonText = coreMessages.buttonAdd,
    saveItemButtonText = coreMessages.reviewButtonSubmit,
    formTitle,
  } = data
  const { formatMessage } = useLocale()
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
  }

  const handleRemoveItem = (index: number) => {
    if (activeIndex === index) setActiveIndex(-1)
    if (activeIndex > index) setActiveIndex(activeIndex - 1)
    remove(index)
  }

  const getFieldError = (id: string) => {
    /**
     * Errors that occur in a field-array have incorrect typing for some reason
     * This hack is needed to get the correct type
     */
    const errorList = error as unknown as Record<string, string>[] | undefined
    const errors = errorList?.[activeIndex]
    return errors?.[id]
  }

  return (
    <Box marginTop={6}>
      <Stack space={4}>
        <T.Table>
          <T.Head>
            <T.Row>
              <T.HeadData></T.HeadData>
              {tableHeader.map((item, index) => (
                <T.HeadData key={index}>
                  {formatText(item ?? '', application, formatMessage)}
                </T.HeadData>
              ))}
            </T.Row>
          </T.Head>
          <T.Body>
            {values &&
              savedFields.map((field, index) => (
                <T.Row key={field.id}>
                  <T.Data>
                    <Box display="flex" alignItems="center">
                      <Tooltip
                        placement="left"
                        text={formatText(
                          coreMessages.deleteFieldText,
                          application,
                          formatMessage,
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                        >
                          <Icon icon="removeCircle" type="outline" />
                        </button>
                      </Tooltip>
                    </Box>
                  </T.Data>
                  {tableRows.map((item, idx) => {
                    const formatFn = table?.format?.[item]
                    return (
                      <T.Data key={`${item}-${idx}`}>
                        {formatFn
                          ? formatFn(values[index][item])
                          : values[index][item]}
                      </T.Data>
                    )
                  })}
                </T.Row>
              ))}
          </T.Body>
        </T.Table>
        {activeField ? (
          <Stack space={2} key={activeField.id}>
            {formTitle && (
              <Text variant="h4">
                {formatText(formTitle, application, formatMessage)}
              </Text>
            )}
            <GridRow rowGap={[2, 2, 2, 3]}>
              {items.map((item) => {
                const {
                  component,
                  id: itemId,
                  backgroundColor = 'blue',
                  label = '',
                  placeholder = '',
                  options,
                  width = 'full',
                  ...props
                } = item
                const isHalfColumn = component !== 'radio' && width === 'half'
                const span = isHalfColumn ? '1/2' : '1/1'
                const Component = componentMapper[component]
                const id = `${data.id}[${activeIndex}].${itemId}`

                const translatedOptions = options?.map((option) => ({
                  ...option,
                  label: formatText(option.label, application, formatMessage),
                }))

                return (
                  <GridColumn key={id} span={['1/1', '1/1', '1/1', span]}>
                    <Component
                      id={id}
                      name={id}
                      label={formatText(label, application, formatMessage)}
                      options={translatedOptions}
                      placeholder={formatText(
                        placeholder,
                        application,
                        formatMessage,
                      )}
                      error={getFieldError(itemId)}
                      control={methods.control}
                      backgroundColor={backgroundColor}
                      onChange={() => {
                        if (error) {
                          methods.clearErrors(id)
                        }
                      }}
                      {...props}
                    />
                  </GridColumn>
                )
              })}
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
            >
              {formatText(addItemButtonText, application, formatMessage)}
            </Button>
          </Box>
        )}
      </Stack>
    </Box>
  )
}
