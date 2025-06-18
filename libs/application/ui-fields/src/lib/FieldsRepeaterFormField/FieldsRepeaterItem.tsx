import {
  formatText,
  getErrorViaPath,
  getValueViaPath,
} from '@island.is/application/core'
import {
  AlertMessageField,
  Application,
  AsyncSelectField,
  FieldComponents,
  FieldTypes,
  HiddenInputField,
  RepeaterItem,
  RepeaterOptionValue,
  StaticText,
  VehiclePermnoWithInfoField,
} from '@island.is/application/types'
import { GridColumn, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { useEffect, useRef } from 'react'
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
import { VehiclePermnoWithInfoFormField } from '../VehiclePermnoWithInfoFormField/VehiclePermnoWithInfoFormField'

interface ItemFieldProps {
  application: Application
  error?: string
  item: RepeaterItem & { id: string }
  dataId: string
  index: number
  values: Array<Record<string, string>>
}

const componentMapper = {
  input: InputController,
  select: SelectController,
  checkbox: CheckboxController,
  date: DatePickerController,
  radio: RadioController,
  nationalIdWithName: NationalIdWithName,
  phone: PhoneInputController,
}

export const Item = ({
  application,
  error,
  item,
  dataId,
  index,
  values,
}: ItemFieldProps) => {
  const { formatMessage, lang } = useLocale()
  const { setValue, getValues, control, clearErrors } = useFormContext()
  const prevWatchedValuesRef = useRef<string | (string | undefined)[]>()
  const apolloClient = useApolloClient()

  const getSpan = (component: string, width: string) => {
    if (component !== 'radio' && component !== 'checkbox') {
      if (width === 'half') {
        return '1/2'
      }
      if (width === 'third') {
        return '1/3'
      }
      return '1/1'
    }
    return '1/1'
  }

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
    setOnChange,
    ...props
  } = item

  const span = getSpan(component, width)
  let Component: React.ComponentType<any>

  if (component === 'selectAsync') {
    Component = AsyncSelectFormField
  } else if (component === 'hiddenInput') {
    Component = HiddenInputFormField
  } else if (component === 'alertMessage') {
    Component = AlertMessageFormField
  } else if (component === 'vehiclePermnoWithInfo') {
    Component = VehiclePermnoWithInfoFormField
  } else {
    Component = componentMapper[component]
  }

  const id = `${dataId}[${index}].${itemId}`
  const activeValues = index >= 0 && values ? values[index] : undefined

  let watchedValues: string | (string | undefined)[] | undefined
  if (updateValueObj) {
    const watchedValuesId =
      typeof updateValueObj.watchValues === 'function'
        ? updateValueObj.watchValues(activeValues)
        : updateValueObj.watchValues

    if (watchedValuesId) {
      if (Array.isArray(watchedValuesId)) {
        watchedValues = watchedValuesId.map((value) => {
          return activeValues?.[`${value}`]
        })
      } else {
        watchedValues = activeValues?.[`${watchedValuesId}`]
      }
    }
  }

  useEffect(() => {
    // We need to deep compare the watched values to avoid unnecessary re-renders
    if (
      watchedValues &&
      !isEqual(prevWatchedValuesRef.current, watchedValues)
    ) {
      prevWatchedValuesRef.current = watchedValues
      if (
        updateValueObj &&
        watchedValues &&
        (Array.isArray(watchedValues)
          ? !watchedValues.every((value) => value === undefined)
          : true)
      ) {
        const finalValue = updateValueObj.valueModifier(
          application,
          activeValues,
        )
        setValue(id, finalValue)
      }
    }
  }, [watchedValues, updateValueObj, activeValues, setValue, id])

  const getFieldError = (id: string) => {
    /**
     * Errors that occur in a field-array have incorrect typing
     * This hack is needed to get the correct type
     */
    const errorList = error as unknown as Record<string, string>[] | undefined
    const errors = errorList?.[index]
    return errors && getErrorViaPath(errors, id)
  }

  const getDefaultValue = (
    item: RepeaterItem,
    application: Application,
    activeField?: Record<string, string>,
  ) => {
    const { defaultValue } = item

    if (defaultValue === undefined) {
      return undefined
    }

    return typeof defaultValue === 'function'
      ? defaultValue(application, activeField)
      : defaultValue
  }

  let translatedOptions: any = []
  if (typeof options === 'function') {
    translatedOptions = options(application, activeValues, lang)
  } else {
    translatedOptions =
      options?.map((option) => ({
        ...option,
        label: formatText(option.label, application, formatMessage),
        ...(option.tooltip && {
          tooltip: formatText(option.tooltip, application, formatMessage),
        }),
      })) ?? []
  }

  if (item.filterOptions && typeof item.filterOptions === 'function') {
    translatedOptions = item.filterOptions(
      translatedOptions,
      getValues(),
      index,
    )
  }

  let readonlyVal: boolean | undefined
  if (typeof readonly === 'function') {
    readonlyVal = readonly(application, activeValues)
  } else {
    readonlyVal = readonly
  }

  let disabledVal: boolean | undefined
  if (typeof disabled === 'function') {
    disabledVal = disabled(application, activeValues)
  } else {
    disabledVal = disabled
  }

  let requiredVal: boolean | undefined
  if (typeof required === 'function') {
    requiredVal = required(application, activeValues)
  } else {
    requiredVal = required
  }

  let isClearableVal: boolean | undefined
  if (typeof isClearable === 'function') {
    isClearableVal = isClearable(application, activeValues)
  } else {
    isClearableVal = isClearable
  }

  let defaultVal: any
  if (component === 'input') {
    defaultVal = getDefaultValue(item, application, activeValues)
  }
  if (component === 'select') {
    defaultVal =
      getValueViaPath(application.answers, id) ??
      getDefaultValue(item, application, activeValues)
  }
  if (component === 'radio') {
    defaultVal =
      getValueViaPath<Array<string>>(application.answers, id) ??
      getDefaultValue(item, application, activeValues)
  }
  if (component === 'checkbox') {
    defaultVal =
      getValueViaPath<Array<string>>(application.answers, id) ??
      getDefaultValue(item, application, activeValues)
  }
  if (component === 'date') {
    defaultVal =
      getValueViaPath<string>(application.answers, id) ??
      getDefaultValue(item, application, activeValues)
  }
  if (component === 'hiddenInput') {
    defaultVal = getDefaultValue(item, application, activeValues)
  }

  let maxDateVal: Date | undefined
  let minDateVal: Date | undefined
  if (component === 'date') {
    maxDateVal =
      typeof item.maxDate === 'function'
        ? item.maxDate(application, activeValues)
        : item.maxDate

    minDateVal =
      typeof item.minDate === 'function'
        ? item.minDate(application, activeValues)
        : item.minDate
  }

  let clearOnChangeVal: string[] | undefined
  if (typeof clearOnChange === 'function') {
    clearOnChangeVal = clearOnChange(index)
  } else {
    clearOnChangeVal = clearOnChange
  }

  const setOnChangeFunc =
    setOnChange &&
    (async (optionValue: RepeaterOptionValue) => {
      if (typeof setOnChange === 'function') {
        return await setOnChange(
          optionValue,
          application,
          index,
          activeValues,
          apolloClient,
        )
      } else {
        return setOnChange || []
      }
    })

  let selectAsyncProps: AsyncSelectField | undefined
  if (component === 'selectAsync') {
    selectAsyncProps = {
      id: id,
      title: label,
      type: FieldTypes.ASYNC_SELECT,
      component: FieldComponents.ASYNC_SELECT,
      children: undefined,
      backgroundColor: backgroundColor,
      isSearchable: item.isSearchable,
      isMulti: item.isMulti,
      loadOptions: (c) =>
        item.loadOptions(c, lang, activeValues, (subKey, value) => {
          setValue(`${dataId}[${index}].${subKey}`, value)
        }),
      updateOnSelect:
        typeof item.updateOnSelect === 'function'
          ? item.updateOnSelect(index)
          : item.updateOnSelect,
      disabled: disabledVal,
      required: requiredVal,
      isClearable: isClearableVal,
      defaultValue: defaultVal,
      clearOnChange: clearOnChangeVal,
      setOnChange: setOnChangeFunc,
    }
  }

  let hiddenInputProps: HiddenInputField | undefined
  if (component === 'hiddenInput') {
    hiddenInputProps = {
      id: id,
      type: FieldTypes.HIDDEN_INPUT,
      component: FieldComponents.HIDDEN_INPUT,
      children: undefined,
      defaultValue: defaultVal,
    }
  }

  let alertMessageProps: AlertMessageField | undefined
  if (component === 'alertMessage') {
    const titleVal =
      typeof item.title === 'function'
        ? item.title(application, activeValues)
        : item.title
    const messageVal =
      typeof item.message === 'function'
        ? item.message(application, activeValues)
        : item.message

    alertMessageProps = {
      id: id,
      type: FieldTypes.ALERT_MESSAGE,
      component: FieldComponents.ALERT_MESSAGE,
      children: undefined,
      alertType: item.alertType,
      title: titleVal,
      message: messageVal,
      marginTop: item.marginTop,
      marginBottom: item.marginBottom,
    }
  }

  let vehiclePermnoWithInfoProps: VehiclePermnoWithInfoField | undefined
  if (component === 'vehiclePermnoWithInfo') {
    vehiclePermnoWithInfoProps = {
      id: id,
      type: FieldTypes.VEHICLE_PERMNO_WITH_INFO,
      component: FieldComponents.VEHICLE_PERMNO_WITH_INFO,
      children: undefined,
      required: item.required,
      loadValidation: item.loadValidation,
      permnoLabel: item.permnoLabel,
      makeAndColorLabel: item.makeAndColorLabel,
      errorTitle: item.errorTitle,
      fallbackErrorMessage: item.fallbackErrorMessage,
      validationFailedErrorMessage: item.validationFailedErrorMessage,
    }
  }

  if (
    typeof condition === 'function'
      ? condition && !condition(application, activeValues)
      : condition
  ) {
    return null
  }

  return (
    <GridColumn span={['1/1', '1/1', '1/1', span]}>
      {component === 'radio' && label && (
        <Text variant="h4" as="h4" id={id + 'title'} marginBottom={3}>
          {formatText(label, application, formatMessage)}
        </Text>
      )}
      {component === 'selectAsync' && selectAsyncProps && (
        <AsyncSelectFormField
          application={application}
          error={getFieldError(itemId)}
          field={{
            ...selectAsyncProps,
          }}
        />
      )}
      {component === 'hiddenInput' && hiddenInputProps && (
        <HiddenInputFormField
          application={application}
          field={{
            ...hiddenInputProps,
          }}
        />
      )}
      {component === 'alertMessage' && alertMessageProps && (
        <AlertMessageFormField
          application={application}
          field={{
            ...alertMessageProps,
          }}
        />
      )}
      {component === 'vehiclePermnoWithInfo' && vehiclePermnoWithInfoProps && (
        <VehiclePermnoWithInfoFormField
          application={application}
          field={{
            ...vehiclePermnoWithInfoProps,
          }}
        />
      )}
      {!(component === 'selectAsync' && selectAsyncProps) &&
        !(component === 'hiddenInput' && hiddenInputProps) &&
        !(component === 'alertMessage' && alertMessageProps) &&
        !(
          component === 'vehiclePermnoWithInfo' && vehiclePermnoWithInfoProps
        ) && (
          <Component
            id={id}
            name={id}
            label={formatMessage(label, {
              index: index + 1,
            })}
            options={translatedOptions}
            split={width === 'half' ? '1/2' : width === 'third' ? '1/3' : '1/1'}
            error={getFieldError(itemId)}
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
            placeholder={formatText(placeholder, application, formatMessage)}
            clearOnChange={clearOnChangeVal}
            setOnChange={setOnChangeFunc}
            {...props}
            {...(component === 'date'
              ? { maxDate: maxDateVal, minDate: minDateVal }
              : {})}
          />
        )}
    </GridColumn>
  )
}
