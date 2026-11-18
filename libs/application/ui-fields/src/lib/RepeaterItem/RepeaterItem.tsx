import {
  coreDefaultFieldMessages,
  DEFAULT_ALLOWED_FILE_TYPES,
  DEFAULT_FILE_SIZE_LIMIT,
  DEFAULT_TOTAL_FILE_SIZE_SUM,
  formatText,
  getErrorViaPath,
  getValueViaPath,
} from '@island.is/application/core'
import {
  Application,
  FieldComponents,
  FieldTypes,
  MaybeWithRepeaterItemContext,
  RepeaterItem,
  RepeaterItemContext,
  RepeaterOptionValue,
  SetFieldLoadingState,
  SetSubmitButtonDisabled,
} from '@island.is/application/types'
import { GridColumn, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ComponentType, useEffect, useRef } from 'react'
import { useFormContext } from 'react-hook-form'
import isEqual from 'lodash/isEqual'
import {
  CheckboxController,
  DatePickerController,
  InputController,
  RadioController,
  SelectController,
  PhoneInputController,
} from '@island.is/shared/form-fields'
import { NationalIdWithName } from '@island.is/application/ui-components'
import { AsyncSelectFormField } from '../AsyncSelectFormField/AsyncSelectFormField'
import { useApolloClient } from '@apollo/client'
import { HiddenInputFormField } from '../HiddenInputFormField/HiddenInputFormField'
import { AlertMessageFormField } from '../AlertMessageFormField/AlertMessageFormField'
import * as styles from './RepeaterItem.css'
import { VehiclePermnoWithInfoFormField } from '../VehiclePermnoWithInfoFormField/VehiclePermnoWithInfoFormField'
import { DescriptionFormField } from '../DescriptionFormField/DescriptionFormField'
import { FileUploadFormField } from '../FileUploadFormField/FileUploadFormField'
import { RecordObject } from '@island.is/shared/types'

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const controllers: Record<string, ComponentType<any>> = {
  input: InputController,
  select: SelectController,
  checkbox: CheckboxController,
  date: DatePickerController,
  radio: RadioController,
  nationalIdWithName: NationalIdWithName,
  phone: PhoneInputController,
}

const TAKES_DEFAULT_VALUE = new Set([
  'input',
  'select',
  'radio',
  'checkbox',
  'date',
  'hiddenInput',
  'nationalIdWithName',
])
const READS_STORED_ANSWER = new Set(['select', 'radio', 'checkbox', 'date'])

const resolve = <T,>(
  value: MaybeWithRepeaterItemContext<T>,
  ctx: RepeaterItemContext,
): T =>
  typeof value === 'function'
    ? (value as (ctx: RepeaterItemContext) => T)(ctx)
    : value

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
    // We need to deep compare the watched values to avoid unnecessary re-renders
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

  const storedAnswer = READS_STORED_ANSWER.has(component)
    ? getValueViaPath(application.answers, id)
    : undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const defaultVal: any = TAKES_DEFAULT_VALUE.has(component)
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

  const controllerProps = () => {
    switch (item.component) {
      case 'date':
        return {
          maxDate: resolve(item.maxDate, ctx),
          minDate: resolve(item.minDate, ctx),
          locale: lang,
        }
      case 'nationalIdWithName':
        return {
          nationalIdDefaultValue:
            defaultVal?.nationalId ?? item.nationalIdDefaultValue,
          nameDefaultValue: defaultVal?.name ?? item.nameDefaultValue,
        }
      case 'input':
        return {
          suffix: item.suffix
            ? formatText(item.suffix, application, formatMessage)
            : undefined,
        }
      case 'phone':
        return { disableDropdown: !(item.enableCountrySelector ?? false) }
      default:
        return {}
    }
  }

  const renderField = () => {
    switch (item.component) {
      case 'selectAsync':
        return (
          <AsyncSelectFormField
            application={application}
            error={fieldError}
            field={{
              id,
              title: labelVal,
              placeholder: placeholderVal,
              type: FieldTypes.ASYNC_SELECT,
              component: FieldComponents.ASYNC_SELECT,
              children: undefined,
              backgroundColor,
              isSearchable: item.isSearchable,
              isMulti: item.isMulti,
              loadOptions: (c) =>
                item.loadOptions(c, {
                  ...ctx,
                  setValueAtIndex: (subKey, value) => {
                    setValue(`${dataId}[${index}].${subKey}`, value)
                  },
                }),
              updateOnSelect: resolve(item.updateOnSelect, ctx),
              disabled: disabledVal,
              required: requiredVal,
              isClearable: isClearableVal,
              defaultValue: defaultVal,
              clearOnChange: clearOnChangeVal,
              setOnChange: setOnChangeFunc,
              loadingError: item.loadingError,
            }}
          />
        )
      case 'hiddenInput':
        return (
          <HiddenInputFormField
            application={application}
            field={{
              id,
              type: FieldTypes.HIDDEN_INPUT,
              component: FieldComponents.HIDDEN_INPUT,
              children: undefined,
              defaultValue: defaultVal,
            }}
          />
        )
      case 'alertMessage':
        return (
          <AlertMessageFormField
            application={application}
            field={{
              id,
              type: FieldTypes.ALERT_MESSAGE,
              component: FieldComponents.ALERT_MESSAGE,
              children: undefined,
              alertType: item.alertType,
              title: resolve(item.title, ctx),
              message: resolve(item.message, ctx),
              marginTop: item.marginTop,
              marginBottom: item.marginBottom,
            }}
          />
        )
      case 'vehiclePermnoWithInfo':
        return (
          <VehiclePermnoWithInfoFormField
            application={application}
            errors={errors}
            field={{
              id,
              type: FieldTypes.VEHICLE_PERMNO_WITH_INFO,
              component: FieldComponents.VEHICLE_PERMNO_WITH_INFO,
              children: undefined,
              required: requiredVal,
              loadValidation: item.loadValidation,
              permnoLabel: item.permnoLabel,
              makeAndColorLabel: item.makeAndColorLabel,
              errorTitle: item.errorTitle,
              fallbackErrorMessage: item.fallbackErrorMessage,
              validationFailedErrorMessage: item.validationFailedErrorMessage,
              isTrailer: item.isTrailer ?? false,
            }}
          />
        )
      case 'description':
        return (
          <DescriptionFormField
            application={application}
            showFieldName
            field={{
              id,
              type: FieldTypes.DESCRIPTION,
              component: FieldComponents.DESCRIPTION,
              children: undefined,
              title: item.title,
              titleVariant: item.titleVariant,
              showRequiredStar: requiredVal,
            }}
          />
        )
      case 'fileUpload':
        return (
          <FileUploadFormField
            application={application}
            error={fieldError}
            showFieldName
            setFieldLoadingState={setFieldLoadingState}
            setSubmitButtonDisabled={setSubmitButtonDisabled}
            field={{
              id,
              type: FieldTypes.FILEUPLOAD,
              component: FieldComponents.FILEUPLOAD,
              children: undefined,
              uploadHeader:
                item.uploadHeader ||
                coreDefaultFieldMessages.defaultFileUploadHeader,
              introduction: item.introduction,
              uploadDescription:
                item.uploadDescription ||
                coreDefaultFieldMessages.defaultFileUploadDescription,
              uploadButtonLabel:
                item.uploadButtonLabel ||
                coreDefaultFieldMessages.defaultFileUploadButtonLabel,
              uploadMultiple: item.uploadMultiple,
              uploadAccept: item.uploadAccept ?? DEFAULT_ALLOWED_FILE_TYPES,
              maxSize: item.maxSize ?? DEFAULT_FILE_SIZE_LIMIT,
              maxSizeErrorText: item.maxSizeErrorText,
              totalMaxSize: item.totalMaxSize ?? DEFAULT_TOTAL_FILE_SIZE_SUM,
              maxFileCount: item.maxFileCount,
              forImageUpload: item.forImageUpload,
            }}
          />
        )
      default: {
        const Controller = controllers[item.component]
        return (
          <>
            {item.component === 'radio' && labelVal && (
              <Text variant="h4" as="h4" id={id + 'title'} marginBottom={3}>
                {formatText(labelVal, application, formatMessage)}
              </Text>
            )}
            <Controller
              id={id}
              name={id}
              label={formatText(labelVal, application, formatMessage)}
              options={translatedOptions}
              placeholder={formatText(
                placeholderVal,
                application,
                formatMessage,
              )}
              split={
                width === 'half' ? '1/2' : width === 'third' ? '1/3' : '1/1'
              }
              error={fieldError}
              control={control}
              readOnly={readonlyVal}
              disabled={disabledVal}
              required={requiredVal}
              isClearable={isClearableVal}
              defaultValue={defaultVal}
              backgroundColor={backgroundColor}
              onChange={() => {
                if (error) {
                  clearErrors(id)
                }
              }}
              application={application}
              large={true}
              clearOnChange={clearOnChangeVal}
              clearOnChangeDefaultValue={clearOnChangeDefaultValue}
              setOnChange={setOnChangeFunc}
              {...props}
              {...controllerProps()}
            />
          </>
        )
      }
    }
  }

  const radioOrCheckbox = component === 'radio' || component === 'checkbox'
  const span =
    radioOrCheckbox || width === 'full'
      ? '1/1'
      : width === 'half'
      ? '1/2'
      : '1/3'

  return (
    <GridColumn
      span={['1/1', '1/1', '1/1', span]}
      {...(compactLayout && {
        position: component === 'hiddenInput' ? 'absolute' : 'relative',
        className:
          component === 'nationalIdWithName' || component === 'selectAsync'
            ? styles.removePaddingTop
            : undefined,
      })}
    >
      {renderField()}
    </GridColumn>
  )
}
