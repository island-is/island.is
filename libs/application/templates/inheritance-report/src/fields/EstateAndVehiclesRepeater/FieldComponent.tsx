import { InputController } from '@island.is/shared/form-fields'
import { GridColumn, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import DoubleColumnRow from '../../components/DoubleColumnRow'
import { parseLabel } from '../../lib/utils/helpers'
import ShareInput from '../../components/ShareInput'
import { RealEstateNumberField } from './RealEstateNumberField'
import { VehicleNumberField } from './VehicleNumberField'
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
  readOnly,
  disabled,
}: FieldComponentProps) => {
  const { formatMessage } = useLocale()

  let content = null

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

  switch (field.id) {
    case 'sectionTitle':
      return (
        <GridColumn key={fieldName} span="1/1">
          <Text
            variant={
              field.sectionTitleVariant ? field.sectionTitleVariant : 'h5'
            }
            marginBottom={2}
          >
            {field.sectionTitle}
          </Text>
        </GridColumn>
      )

    case 'assetNumber':
      if (assetKey === 'assets') {
        content = (
          <RealEstateNumberField
            field={field}
            fieldName={fieldName}
            fieldIndex={fieldIndex}
            setLoadingFieldName={setLoadingFieldName}
            {...defaultProps}
          />
        )
      } else if (assetKey === 'vehicles') {
        content = (
          <VehicleNumberField
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
