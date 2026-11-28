import {
  formatText,
  getErrorViaPath,
  getValueViaPath,
} from '@island.is/application/core'
import {
  Application,
  RepeaterItem,
  RepeaterItemContext,
  RepeaterOptionValue,
  SetFieldLoadingState,
  SetSubmitButtonDisabled,
} from '@island.is/application/types'
import { GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useEffect, useRef } from 'react'
import { useFormContext } from 'react-hook-form'
import isEqual from 'lodash/isEqual'
import { useApolloClient } from '@apollo/client'
import * as styles from './RepeaterItem.css'
import { RecordObject } from '@island.is/shared/types'
import { getFieldType, resolve } from './fieldTypes'

interface ItemFieldProps {
  application: Application
  error?: string
  errors?: RecordObject
  item: RepeaterItem & { id: string }
  dataId: string
  index: number
  values: Array<Record<string, string>>
  setFieldLoadingState?: SetFieldLoadingState
  setSubmitButtonDisabled?: SetSubmitButtonDisabled
  compactLayout?: boolean
}

export const Item = ({
  application,
  error,
  errors,
  item,
  dataId,
  index,
  values,
  setFieldLoadingState,
  setSubmitButtonDisabled,
  compactLayout = false,
}: ItemFieldProps) => {
  const { formatMessage, lang } = useLocale()
  const { setValue, getValues, control, clearErrors } = useFormContext()
  const prevWatchedValuesRef = useRef<string | (string | undefined)[]>(
    undefined,
  )
  const apolloClient = useApolloClient()

  const {
    component,
    id: itemId,
    backgroundColor = 'blue',
    label = '',
    placeholder = '',
    options,
    width = 'full',
    condition,
    readonly = false,
    disabled = false,
    required = false,
    isClearable = false,
    updateValueObj,
    defaultValue,
    clearOnChange,
    clearOnChangeDefaultValue,
    setOnChange,
    ...props
  } = item

  const id = `${dataId}[${index}].${itemId}`
  const activeValues = index >= 0 && values ? values[index] : undefined
  const ctx: RepeaterItemContext = {
    application: { ...application, answers: getValues() },
    row: activeValues,
    index,
    locale: lang,
    formatMessage,
    apolloClient,
  }

  const watchIds = updateValueObj && resolve(updateValueObj.watchValues, ctx)
  const watchedValues = Array.isArray(watchIds)
    ? watchIds.map((key) => activeValues?.[key])
    : watchIds
    ? activeValues?.[watchIds]
    : undefined

  useEffect(() => {
    if (
      !watchedValues ||
      isEqual(prevWatchedValuesRef.current, watchedValues)
    ) {
      return
    }
    prevWatchedValuesRef.current = watchedValues
    const allUndefined =
      Array.isArray(watchedValues) &&
      watchedValues.every((value) => value === undefined)
    if (updateValueObj && !allUndefined) {
      setValue(id, updateValueObj.valueModifier(ctx))
    }
  }, [watchedValues, updateValueObj, activeValues, setValue, id])

  /**
   * Errors that occur in a field-array have incorrect typing
   * This hack is needed to get the correct type
   */
  const errorList = error as unknown as Record<string, string>[] | undefined
  const rowErrors = errorList?.[index]
  const fieldError = rowErrors && getErrorViaPath(rowErrors, itemId)

  const resolvedOptions =
    typeof options === 'function'
      ? options(ctx)
      : options?.map((option) => ({
          ...option,
          label: formatText(option.label, application, formatMessage),
          ...(option.tooltip && {
            tooltip: formatText(option.tooltip, application, formatMessage),
          }),
        })) ?? []
  const translatedOptions = item.filterOptions
    ? item.filterOptions(resolvedOptions, ctx)
    : resolvedOptions

  const readonlyVal = resolve(readonly, ctx)
  const disabledVal = resolve(disabled, ctx)
  const requiredVal = resolve(required, ctx)
  const isClearableVal = resolve(isClearable, ctx)
  const clearOnChangeVal = resolve(clearOnChange, ctx)
  const labelVal = resolve(label, ctx)
  const placeholderVal = resolve(placeholder, ctx)

  const fieldType = getFieldType(component)
  const storedAnswer = fieldType.readsStoredAnswer
    ? getValueViaPath(application.answers, id)
    : undefined
  const defaultVal = fieldType.takesDefaultValue
    ? storedAnswer ?? resolve(defaultValue, ctx)
    : undefined

  const setOnChangeFunc =
    setOnChange &&
    (async (optionValue: RepeaterOptionValue) =>
      typeof setOnChange === 'function'
        ? setOnChange(optionValue, {
            ...ctx,
            application: { ...application, answers: getValues() },
          })
        : setOnChange)

  const hidden = typeof condition === 'function' ? !condition(ctx) : condition
  if (hidden) {
    return null
  }

  const controllerProps = {
    id,
    name: id,
    label: formatText(labelVal, application, formatMessage),
    options: translatedOptions,
    placeholder: formatText(placeholderVal, application, formatMessage),
    split: width === 'half' ? '1/2' : width === 'third' ? '1/3' : '1/1',
    error: fieldError,
    control,
    readOnly: readonlyVal,
    disabled: disabledVal,
    required: requiredVal,
    isClearable: isClearableVal,
    defaultValue: defaultVal,
    backgroundColor,
    onChange: () => {
      if (error) {
        clearErrors(id)
      }
    },
    application,
    large: true,
    clearOnChange: clearOnChangeVal,
    clearOnChangeDefaultValue,
    setOnChange: setOnChangeFunc,
    ...props,
  }

  const span =
    fieldType.fullWidth || width === 'full'
      ? '1/1'
      : width === 'half'
      ? '1/2'
      : '1/3'

  return (
    <GridColumn
      span={['1/1', '1/1', '1/1', span]}
      {...(compactLayout && {
        position: fieldType.compact?.absolute ? 'absolute' : 'relative',
        className: fieldType.compact?.removePaddingTop
          ? styles.removePaddingTop
          : undefined,
      })}
    >
      {fieldType.render({
        item,
        id,
        ctx,
        application,
        errors,
        fieldError,
        label: labelVal,
        placeholder: placeholderVal,
        disabled: disabledVal,
        required: requiredVal,
        isClearable: isClearableVal,
        clearOnChange: clearOnChangeVal,
        defaultValue: defaultVal,
        backgroundColor,
        setOnChange: setOnChangeFunc,
        setValueInRow: (key, value) =>
          setValue(`${dataId}[${index}].${key}`, value),
        controllerProps,
        setFieldLoadingState,
        setSubmitButtonDisabled,
      })}
    </GridColumn>
  )
}
