import { InputController } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import DoubleColumnRow from '../../components/DoubleColumnRow'
import { parseLabel } from '../../lib/utils/helpers'
import ShareInput from '../../components/ShareInput'
import { RealEstateLookup } from './RealEstateLookup'
import { VehicleLookup } from './VehicleLookup'
import { FieldComponentProps } from './types'

export const FieldComponent = ({
  assetKey,
  onAfterChange,
  setLoadingFieldName,
  loadingFieldName,
  pushRight,
  field,
  fieldIndex,
  fieldName,
  error,
  answers,
  isInitial,
  disabled,
}: FieldComponentProps) => {
  const { formatMessage } = useLocale()

  // For initial/prefilled rows, only the share field is editable
  const readOnly = isInitial && field.id !== 'share'

  const defaultProps = {
    ...field,
    id: fieldName,
    name: fieldName,
    format: field.format,
    label: formatMessage(parseLabel(field.title, answers)),
    defaultValue: '',
    type: field.type,
    placeholder: field.placeholder,
    backgroundColor: field.color ? field.color : 'blue',
    currency: field.currency,
    required: readOnly ? false : field.required,
    loading: fieldName === loadingFieldName,
    suffix: field.suffix,
    onChange: () => onAfterChange?.(),
    error: error,
    readOnly: readOnly,
    disabled: disabled,
  }

  let content

  switch (field.id) {
    case 'assetNumber':
      if (assetKey === 'assets') {
        content = (
          <RealEstateLookup
            field={field}
            fieldName={fieldName}
            fieldIndex={fieldIndex}
            setLoadingFieldName={setLoadingFieldName}
            {...defaultProps}
          />
        )
      } else if (assetKey === 'vehicles') {
        content = (
          <VehicleLookup
            field={field}
            fieldName={fieldName}
            fieldIndex={fieldIndex}
            setLoadingFieldName={setLoadingFieldName}
            {...defaultProps}
          />
        )
      }
      break

    case 'share':
      content = (
        <ShareInput
          name={fieldName}
          label={formatMessage(m.propertyShare)}
          onAfterChange={onAfterChange}
          readOnly={readOnly}
          hasError={!!error}
          required={field.required && !readOnly}
          disabled={disabled}
        />
      )
      break

    default:
      content = <InputController {...defaultProps} />
      break
  }

  return (
    <DoubleColumnRow
      span={field.width === 'full' ? ['1/1', '1/1'] : ['1/1', '1/2']}
      pushRight={pushRight}
      paddingBottom={2}
      key={fieldName}
    >
      {content}
    </DoubleColumnRow>
  )
}
