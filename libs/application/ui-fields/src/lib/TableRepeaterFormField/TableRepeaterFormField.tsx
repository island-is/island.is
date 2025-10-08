import {
  coreMessages,
  coreErrorMessages,
  formatText,
  formatTextWithLocale,
} from '@island.is/application/core'
import {
  Application,
  FieldBaseProps,
  TableRepeaterField,
} from '@island.is/application/types'
import {
  AlertMessage,
  Box,
  Button,
  ErrorMessage,
  GridRow,
  Icon,
  Stack,
  Table as T,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldDescription } from '@island.is/shared/form-fields'
import { FC, useEffect, useRef, useState } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import {
  buildDefaultTableHeader,
  buildDefaultTableRows,
  handleCustomMappedValues,
  setObjectWithNestedKey,
} from './utils'
import { Item } from './TableRepeaterItem'
import { Locale } from '@island.is/shared/types'
import { useApolloClient } from '@apollo/client/react'
import { uuid } from 'uuidv4'

interface Props extends FieldBaseProps {
  field: TableRepeaterField
}

export const TableRepeaterFormField: FC<Props> = ({
  application,
  setBeforeSubmitCallback,
  field: data,
  showFieldName,
  error,
  errors,
}) => {
  const {
    fields: rawItems,
    table,
    formTitle,
    description,
    marginTop = 6,
    marginBottom,
    getStaticTableData,
    title = '',
    titleVariant = 'h4',
    addItemButtonText = coreMessages.buttonAdd,
    cancelButtonText = coreMessages.buttonCancel,
    saveItemButtonText = coreMessages.reviewButtonSubmit,
    removeButtonTooltipText = coreMessages.deleteFieldText,
    editButtonTooltipText = coreMessages.editFieldText,
    editField = false,
    maxRows,
    onSubmitLoad,
    loadErrorMessage,
    initActiveFieldIfEmpty,
  } = data

  const apolloClient = useApolloClient()
  const [loadError, setLoadError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const items = Object.keys(rawItems).map((key) => ({
    id: key,
    ...rawItems[key],
  }))

  const load = async () => {
    if (!onSubmitLoad) {
      return
    }

    try {
      setLoadError(false)
      const submitResponse = await onSubmitLoad({
        apolloClient,
        application,
        tableItems: values,
      })

      submitResponse.dictionaryOfItems.forEach((x) => {
        methods.setValue(x.path, x.value)
      })
    } catch (e) {
      console.error('e', e)
      setLoadError(true)
    }
  }

  const { formatMessage, lang: locale } = useLocale()
  const methods = useFormContext()
  const [activeIndex, setActiveIndex] = useState(-1)
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: data.id,
  })
  const [isEditing, setIsEditing] = useState(false)

  const values = useWatch({ name: data.id, control: methods.control })
  const activeField = activeIndex >= 0 ? fields[activeIndex] : null
  const savedFields = fields.filter((_, index) => index !== activeIndex)
  const tableItems = items.filter((x) => x.displayInTable !== false)
  const tableHeader = table?.header ?? buildDefaultTableHeader(tableItems)
  const tableRows = table?.rows ?? buildDefaultTableRows(tableItems)
  const staticData = getStaticTableData?.(application)
  const canAddItem = maxRows ? savedFields.length < maxRows : true

  // check for components that might need some custom value mapping
  const customMappedValues = handleCustomMappedValues(tableItems, values)

  const handleSaveItem = async (index: number) => {
    const isValid = await methods.trigger(`${data.id}[${index}]`, {
      shouldFocus: true,
    })

    if (isValid) {
      setActiveIndex(-1)
      await load()
    }
    setIsEditing(false)
  }

  const handleCancelItem = (index: number) => {
    setActiveIndex(-1)
    if (!isEditing) {
      remove(index)
    }
    setIsEditing(false)
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
    setIsEditing(true)
  }

  const formatTableValue = (
    key: string,
    item: Record<string, string>,
    index: number,
    application: Application,
  ) => {
    item[key] = item[key] ?? ''
    const formatFn = table?.format?.[key]
    const formatted = formatFn
      ? formatFn(item[key], index, application)
      : item[key]
    return typeof formatted === 'string'
      ? formatted
      : Array.isArray(formatted)
      ? formatText(formatted, application, formatMessage).join(', ')
      : formatText(formatted, application, formatMessage)
  }

  useEffect(() => {
    const values = methods.getValues(data.id) || []
    if (initActiveFieldIfEmpty && values?.length === 0) {
      // Using setObjectValue to handle nested ids
      const newValues = {}
      setObjectWithNestedKey(newValues, data.id, [{}])
      methods.reset({
        ...newValues,
      })
      setActiveIndex(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keep activeIndex in a ref so setBeforeSubmit callback always has latest value
  const activeIndexRef = useRef(activeIndex)
  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  // Register a beforeSubmit callback that blocks form submission until the active registration is completed
  // Persist a unique callback ID across renders to avoid re-registering in setBeforeSubmitCallback
  const callbackIdRef = useRef(`TableRepeaterFormField-${uuid()}`)
  useEffect(() => {
    setBeforeSubmitCallback?.(
      async () => {
        if (activeIndexRef.current !== -1) {
          setErrorMessage(
            formatMessage(coreErrorMessages.needToFinishRegistration),
          )
          return [
            false,
            formatMessage(coreErrorMessages.needToFinishRegistration),
          ]
        }
        setErrorMessage(null)
        return [true, null]
      },
      { allowMultiple: true, customCallbackId: callbackIdRef.current },
    )
  }, [formatMessage, setBeforeSubmitCallback])

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
              {staticData &&
                staticData.map((item, index) => (
                  <T.Row key={index}>
                    <T.Data></T.Data>
                    {Object.keys(item).map((key, idx) => (
                      <T.Data key={`static-${key}-${idx}`}>
                        {formatTableValue(key, item, index, application)}
                      </T.Data>
                    ))}
                  </T.Row>
                ))}
              {values &&
                savedFields.map((field, index) => (
                  <T.Row key={field.id}>
                    <T.Data>
                      <Box display="flex" alignItems="center">
                        <Tooltip
                          placement="left"
                          text={formatText(
                            removeButtonTooltipText,
                            application,
                            formatMessage,
                          )}
                        >
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <Icon icon="trash" type="outline" color="blue400" />
                          </button>
                        </Tooltip>
                        &nbsp;&nbsp;
                        {editField && (
                          <Tooltip
                            placement="left"
                            text={formatText(
                              editButtonTooltipText,
                              application,
                              formatMessage,
                            )}
                          >
                            <button
                              type="button"
                              onClick={() => handleEditItem(index)}
                            >
                              <Icon
                                icon="pencil"
                                color="blue400"
                                type="outline"
                                size="small"
                              />
                            </button>
                          </Tooltip>
                        )}
                      </Box>
                    </T.Data>
                    {tableRows.map((item, idx) => (
                      <T.Data
                        key={`${item}-${idx}`}
                        disabled={
                          values[index].disabled === 'true' ? true : false
                        }
                      >
                        {formatTableValue(
                          item,
                          customMappedValues.length
                            ? customMappedValues[index]
                            : values[index],
                          index,
                          application,
                        )}
                      </T.Data>
                    ))}
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
                {items.map((item) => (
                  <Item
                    key={`${data.id}[${activeIndex}].${item.id}`}
                    application={application}
                    error={error}
                    errors={errors}
                    item={item}
                    dataId={data.id}
                    activeIndex={activeIndex}
                    values={values}
                  />
                ))}
              </GridRow>
              <Box display="flex" alignItems="center" justifyContent="flexEnd">
                <Box>
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => handleCancelItem(activeIndex)}
                  >
                    {formatText(cancelButtonText, application, formatMessage)}
                  </Button>
                </Box>
                <Box marginLeft={2}>
                  <Button
                    type="button"
                    onClick={() => handleSaveItem(activeIndex)}
                  >
                    {formatText(saveItemButtonText, application, formatMessage)}
                  </Button>
                </Box>
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
        {error && typeof error === 'string' && (
          <Box marginTop={3}>
            <AlertMessage type="error" title={error} />
          </Box>
        )}
        {loadError && loadErrorMessage && (
          <Box marginTop={3}>
            <AlertMessage
              type="error"
              title={formatText(loadErrorMessage, application, formatMessage)}
            />
          </Box>
        )}
        {errorMessage && (
          <ErrorMessage id={`${data.id}-error`}>{errorMessage}</ErrorMessage>
        )}
      </Box>
    </Box>
  )
}
