import { formatText, getValueViaPath } from '@island.is/application/core'
import {
  Application,
  AsyncSelectContext,
  AsyncSelectField,
  FieldComponents,
  FieldTypes,
  Option,
  RepeaterItem,
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

interface ItemFieldProps {
  application: Application
  error?: string
  item: RepeaterItem & { id: string }
  dataId: string
  activeIndex: number
  values: Array<Record<string, string>>
  loadOptions?: (c: AsyncSelectContext) => Promise<Option[]>
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
  activeIndex,
  values,
}: ItemFieldProps) => {
  const { formatMessage } = useLocale()
  const { setValue, control, clearErrors } = useFormContext()
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
    updateValueObj,
    defaultValue,
    ...props
  } = item

  const span = getSpan(component, width)
  let Component: React.ComponentType<any>
  if (component === 'selectAsync') {
    Component = AsyncSelectFormField
  } else {
    Component = componentMapper[component]
  }
  const id = `${dataId}[${activeIndex}].${itemId}`
  const activeValues =
    activeIndex >= 0 && values ? values[activeIndex] : undefined

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
    const errors = errorList?.[activeIndex]
    return errors?.[id]
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

    return defaultValue(application, activeField)
  }

  let translatedOptions: any = []
  if (typeof options === 'function') {
    translatedOptions = options(application, activeValues)
  } else {
    translatedOptions = options?.map((option) => ({
      ...option,
      label: formatText(option.label, application, formatMessage),
      ...(option.tooltip && {
        tooltip: formatText(option.tooltip, application, formatMessage),
      }),
    }))
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
      (getValueViaPath(application.answers, id) as string[]) ??
      getDefaultValue(item, application, activeValues)
  }
  if (component === 'checkbox') {
    DefaultValue =
      (getValueViaPath(application.answers, id) as string[]) ??
      getDefaultValue(item, application, activeValues)
  }
  if (component === 'date') {
    DefaultValue =
      (getValueViaPath(application.answers, id) as string) ??
      getDefaultValue(item, application, activeValues)
  }

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
      loadOptions: item.loadOptions,
      clearOnChange: item.clearOnChange,
      updateOnSelect: `${dataId}[${activeIndex}].${item.updateOnSelect}`,
    }
  }

  if (condition && !condition(application, activeValues)) {
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
      {component !== 'selectAsync' && (
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
          backgroundColor={backgroundColor}
          onChange={() => {
            if (error) {
              clearErrors(id)
            }
          }}
          application={application}
          defaultValue={DefaultValue}
          large={true}
          {...props}
        />
      )}
    </GridColumn>
  )
}
