import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { formatText } from '@island.is/application/core'
import { FieldBaseProps, PhoneField } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import {
  PhoneInputController,
  FieldDescription,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { getDefaultValue } from '../../getDefaultValue'
import { useFeatureFlag } from '@island.is/react/feature-flags'

interface Props extends FieldBaseProps {
  field: PhoneField
}

export const PhoneFormField: FC<React.PropsWithChildren<Props>> = ({
  autoFocus,
  application,
  error,
  field,
  showFieldName,
}) => {
  const {
    id,
    disabled,
    title,
    description,
    placeholder,
    backgroundColor,
    required,
    readOnly,
    dataTestId,
    allowedCountryCodes,
    disableDropdown,
    onChange = () => undefined,
  } = field
  const { control, clearErrors } = useFormContext()
  const { formatMessage } = useLocale()
  const { value: isPhoneInputV2Enabled } = useFeatureFlag(
    'isPhoneInputV2Enabled',
    false,
  )

  return (
    <div>
      {description && (
        <FieldDescription
          description={formatText(description, application, formatMessage)}
        />
      )}

      <Box paddingTop={2}>
        <PhoneInputController
          disabled={disabled}
          readOnly={readOnly}
          id={id}
          dataTestId={dataTestId}
          allowedCountryCodes={allowedCountryCodes}
          placeholder={formatText(
            placeholder || '',
            application,
            formatMessage,
          )}
          label={
            showFieldName
              ? formatText(title, application, formatMessage)
              : undefined
          }
          autoFocus={autoFocus}
          error={error}
          control={control}
          disableDropdown={disableDropdown || !isPhoneInputV2Enabled}
          onChange={(e) => {
            if (error) {
              clearErrors(id)
            }
            onChange(e)
          }}
          defaultValue={getDefaultValue(field, application)}
          backgroundColor={backgroundColor}
          required={required}
        />
      </Box>
    </div>
  )
}
