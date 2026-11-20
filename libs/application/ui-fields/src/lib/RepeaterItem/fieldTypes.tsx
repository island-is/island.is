import {
  coreDefaultFieldMessages,
  coreMessages,
  DEFAULT_ALLOWED_FILE_TYPES,
  DEFAULT_FILE_SIZE_LIMIT,
  DEFAULT_TOTAL_FILE_SIZE_SUM,
  formatText,
} from '@island.is/application/core'
import {
  Application,
  FieldComponents,
  FieldTypes,
  MaybeWithRepeaterItemContext,
  RepeaterFields,
  RepeaterItem,
  RepeaterItemContext,
  RepeaterOptionValue,
  SetFieldLoadingState,
  SetSubmitButtonDisabled,
  StaticText,
  TableRepeaterColumn,
} from '@island.is/application/types'
import { Text } from '@island.is/island-ui/core'
import {
  CheckboxController,
  DatePickerController,
  InputController,
  PhoneInputController,
  RadioController,
  SelectController,
} from '@island.is/shared/form-fields'
import { NationalIdWithName } from '@island.is/application/ui-components'
import { RecordObject } from '@island.is/shared/types'
import { ComponentType, ReactNode } from 'react'
import * as kennitala from 'kennitala'
import { AsyncSelectFormField } from '../AsyncSelectFormField/AsyncSelectFormField'
import { HiddenInputFormField } from '../HiddenInputFormField/HiddenInputFormField'
import { AlertMessageFormField } from '../AlertMessageFormField/AlertMessageFormField'
import { VehiclePermnoWithInfoFormField } from '../VehiclePermnoWithInfoFormField/VehiclePermnoWithInfoFormField'
import { DescriptionFormField } from '../DescriptionFormField/DescriptionFormField'
import { FileUploadFormField } from '../FileUploadFormField/FileUploadFormField'

type ItemOf<C extends RepeaterFields> = Extract<
  RepeaterItem,
  { component: C }
> & { id: string }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TableRow = Record<string, any>

export type FieldRenderProps<I = RepeaterItem & { id: string }> = {
  item: I
  id: string
  ctx: RepeaterItemContext
  application: Application
  errors?: RecordObject
  fieldError?: string
  label: StaticText
  placeholder: StaticText
  disabled: boolean
  required: boolean
  isClearable: boolean
  clearOnChange?: string[]
  defaultValue: unknown
  backgroundColor: 'blue' | 'white'
  setOnChange?: (
    value: RepeaterOptionValue,
  ) => Promise<{ key: string; value: unknown }[]>
  setValueInRow: (key: string, value: unknown) => void
  controllerProps: Record<string, unknown>
  setFieldLoadingState?: SetFieldLoadingState
  setSubmitButtonDisabled?: SetSubmitButtonDisabled
}

type FieldType<C extends RepeaterFields> = {
  render: (props: FieldRenderProps<ItemOf<C>>) => ReactNode
  takesDefaultValue?: boolean
  readsStoredAnswer?: boolean
  fullWidth?: boolean
  compact?: { absolute?: boolean; removePaddingTop?: boolean }
  tableColumns?: (item: ItemOf<C>, header: StaticText) => TableRepeaterColumn[]
  toTableRow?: (item: ItemOf<C>, row: TableRow) => TableRow
}

export const resolve = <T,>(
  value: MaybeWithRepeaterItemContext<T>,
  ctx: RepeaterItemContext,
): T =>
  typeof value === 'function'
    ? (value as (ctx: RepeaterItemContext) => T)(ctx)
    : value

const controller =
  <C extends RepeaterFields>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Controller: ComponentType<any>,
    extraProps?: (props: FieldRenderProps<ItemOf<C>>) => object,
  ) =>
  (props: FieldRenderProps<ItemOf<C>>) =>
    <Controller {...props.controllerProps} {...extraProps?.(props)} />

const flattenNested = (itemId: string, nested: object) =>
  Object.fromEntries(
    Object.entries(nested).map(([key, value]) => [`${itemId}.${key}`, value]),
  )

const fieldTypes: { [C in RepeaterFields]: FieldType<C> } = {
  input: {
    takesDefaultValue: true,
    render: controller(InputController, ({ item, application, ctx }) => ({
      suffix: item.suffix
        ? formatText(item.suffix, application, ctx.formatMessage)
        : undefined,
    })),
  },
  select: {
    takesDefaultValue: true,
    readsStoredAnswer: true,
    render: controller(SelectController),
  },
  radio: {
    takesDefaultValue: true,
    readsStoredAnswer: true,
    fullWidth: true,
    render: (props) => (
      <>
        {props.label && (
          <Text variant="h4" as="h4" id={props.id + 'title'} marginBottom={3}>
            {formatText(
              props.label,
              props.application,
              props.ctx.formatMessage,
            )}
          </Text>
        )}
        {controller(RadioController)(props)}
      </>
    ),
  },
  checkbox: {
    takesDefaultValue: true,
    readsStoredAnswer: true,
    fullWidth: true,
    render: controller(CheckboxController),
  },
  date: {
    takesDefaultValue: true,
    readsStoredAnswer: true,
    render: controller(DatePickerController, ({ item, ctx }) => ({
      maxDate: resolve(item.maxDate, ctx),
      minDate: resolve(item.minDate, ctx),
      locale: ctx.locale,
    })),
  },
  nationalIdWithName: {
    takesDefaultValue: true,
    compact: { removePaddingTop: true },
    render: controller(NationalIdWithName, ({ item, defaultValue }) => {
      const value = defaultValue as
        | { nationalId?: string; name?: string }
        | undefined
      return {
        nationalIdDefaultValue:
          value?.nationalId ?? item.nationalIdDefaultValue,
        nameDefaultValue: value?.name ?? item.nameDefaultValue,
      }
    }),
    tableColumns: () => [
      { header: coreMessages.name, value: 'name' },
      { header: coreMessages.nationalId, value: 'nationalId' },
    ],
    toTableRow: (item, row) => {
      const nested = row[item.id]
      if (!nested || typeof nested !== 'object') {
        return row
      }
      const { [item.id]: _, ...rest } = row
      return {
        ...nested,
        nationalId: kennitala.format(nested?.nationalId),
        ...rest,
        ...flattenNested(item.id, nested),
      }
    },
  },
  phone: {
    render: controller(PhoneInputController, ({ item }) => ({
      disableDropdown: !(item.enableCountrySelector ?? false),
    })),
  },
  selectAsync: {
    compact: { removePaddingTop: true },
    render: (props) => (
      <AsyncSelectFormField
        application={props.application}
        error={props.fieldError}
        field={{
          id: props.id,
          title: props.label,
          placeholder: props.placeholder,
          type: FieldTypes.ASYNC_SELECT,
          component: FieldComponents.ASYNC_SELECT,
          children: undefined,
          backgroundColor: props.backgroundColor,
          isSearchable: props.item.isSearchable,
          isMulti: props.item.isMulti,
          loadOptions: (c) =>
            props.item.loadOptions(c, {
              ...props.ctx,
              setValueAtIndex: props.setValueInRow,
            }),
          updateOnSelect: resolve(props.item.updateOnSelect, props.ctx),
          disabled: props.disabled,
          required: props.required,
          isClearable: props.isClearable,
          defaultValue: props.defaultValue,
          clearOnChange: props.clearOnChange,
          setOnChange: props.setOnChange,
          loadingError: props.item.loadingError,
        }}
      />
    ),
  },
  hiddenInput: {
    takesDefaultValue: true,
    compact: { absolute: true },
    render: (props) => (
      <HiddenInputFormField
        application={props.application}
        field={{
          id: props.id,
          type: FieldTypes.HIDDEN_INPUT,
          component: FieldComponents.HIDDEN_INPUT,
          children: undefined,
          defaultValue: props.defaultValue,
        }}
      />
    ),
  },
  alertMessage: {
    render: ({ item, id, application, ctx }) => (
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
    ),
  },
  vehiclePermnoWithInfo: {
    render: ({ item, id, application, errors, required }) => (
      <VehiclePermnoWithInfoFormField
        application={application}
        errors={errors}
        field={{
          id,
          type: FieldTypes.VEHICLE_PERMNO_WITH_INFO,
          component: FieldComponents.VEHICLE_PERMNO_WITH_INFO,
          children: undefined,
          required,
          loadValidation: item.loadValidation,
          permnoLabel: item.permnoLabel,
          makeAndColorLabel: item.makeAndColorLabel,
          errorTitle: item.errorTitle,
          fallbackErrorMessage: item.fallbackErrorMessage,
          validationFailedErrorMessage: item.validationFailedErrorMessage,
          isTrailer: item.isTrailer ?? false,
        }}
      />
    ),
    tableColumns: (item, header) => [{ header, value: `${item.id}.permno` }],
    toTableRow: (item, row) => {
      const nested = row[item.id]
      if (!nested || typeof nested !== 'object') {
        return row
      }
      const { [item.id]: _, ...rest } = row
      return { ...rest, ...flattenNested(item.id, nested) }
    },
  },
  description: {
    render: ({ item, id, application, required }) => (
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
          showRequiredStar: required,
        }}
      />
    ),
  },
  fileUpload: {
    render: ({ item, ...props }) => (
      <FileUploadFormField
        application={props.application}
        error={props.fieldError}
        showFieldName
        setFieldLoadingState={props.setFieldLoadingState}
        setSubmitButtonDisabled={props.setSubmitButtonDisabled}
        field={{
          id: props.id,
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
    ),
  },
}

export const getFieldType = (component: RepeaterFields) =>
  fieldTypes[component] as FieldType<RepeaterFields>
