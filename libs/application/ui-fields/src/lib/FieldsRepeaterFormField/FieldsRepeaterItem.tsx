import {
  formatText,
  getErrorViaPath,
  getValueViaPath,
} from '@island.is/application/core'
import { Application, RepeaterItem } from '@island.is/application/types'
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
    ...props
  } = item

  const span = getSpan(component, width)
  const Component = componentMapper[component]
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

  if (props.filterOptions && typeof props.filterOptions === 'function') {
    translatedOptions = props.filterOptions(
      translatedOptions,
      getValues(),
      index,
    )
  }

  let Readonly: boolean | undefined
  if (typeof readonly === 'function') {
    Readonly = readonly(application, activeValues)
  } else {
    Readonly = readonly
  }

  let Disabled: boolean | undefined
  if (typeof disabled === 'function') {
    Disabled = disabled(application, activeValues)
  } else {
    Disabled = disabled
  }

  let Required: boolean | undefined
  if (typeof required === 'function') {
    Required = required(application, activeValues)
  } else {
    Required = required
  }

  let IsClearable: boolean | undefined
  if (typeof isClearable === 'function') {
    IsClearable = isClearable(application, activeValues)
  } else {
    IsClearable = isClearable
  }

  let DefaultValue: any
  if (component === 'input') {
    DefaultValue = getDefaultValue(item, application, activeValues)
  }
  if (component === 'select') {
    DefaultValue =
      getValueViaPath(application.answers, id) ??
      getDefaultValue(item, application, activeValues)
  }
  if (component === 'radio') {
    DefaultValue =
      getValueViaPath<Array<string>>(application.answers, id) ??
      getDefaultValue(item, application, activeValues)
  }
  if (component === 'checkbox') {
    DefaultValue =
      getValueViaPath<Array<string>>(application.answers, id) ??
      getDefaultValue(item, application, activeValues)
  }
  if (component === 'date') {
    DefaultValue =
      getValueViaPath<string>(application.answers, id) ??
      getDefaultValue(item, application, activeValues)
  }

  if (
    typeof condition === 'function'
      ? condition && !condition(application, activeValues)
      : condition
  ) {
    return null
  }

  const mapKeyWithIndex = (key: string) => {
    return `${dataId}[${index}].${key}`
  }

  const ClearOnChange = props.clearOnChangeByIndex?.map((key) =>
    mapKeyWithIndex(key),
  )

  const SetOnChange =
    props.setOnChangeByIndex &&
    ((option: any) => {
      if (typeof props.setOnChangeByIndex === 'function') {
        return props
          .setOnChangeByIndex(option, application)
          .map(({ key, value }) => ({
            key: mapKeyWithIndex(key),
            value,
          }))
      } else {
        return (
          props.setOnChangeByIndex?.map(({ key, value }) => ({
            key: mapKeyWithIndex(key),
            value,
          })) || []
        )
      }
    })

  return (
    <GridColumn span={['1/1', '1/1', '1/1', span]}>
      {component === 'radio' && label && (
        <Text variant="h4" as="h4" id={id + 'title'} marginBottom={3}>
          {formatText(label, application, formatMessage)}
        </Text>
      )}
      <Component
        id={id}
        name={id}
        label={formatText(label, application, formatMessage)}
        options={translatedOptions}
        placeholder={formatText(placeholder, application, formatMessage)}
        split={width === 'half' ? '1/2' : width === 'third' ? '1/3' : '1/1'}
        error={getFieldError(itemId)}
        control={control}
        readOnly={Readonly}
        disabled={Disabled}
        required={Required}
        isClearable={IsClearable}
        backgroundColor={backgroundColor}
        onChange={() => {
          if (error) {
            clearErrors(id)
          }
        }}
        application={application}
        defaultValue={DefaultValue}
        large={true}
        clearOnChange={ClearOnChange}
        setOnChange={SetOnChange}
        {...props}
      />
    </GridColumn>
  )
}
