import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { formatText } from '@island.is/application/core'
import { FieldBaseProps, PhoneField } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import {
  PhoneInputController,
  FieldDescription,
  InputController,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { getDefaultValue } from '../../getDefaultValue'
import { useFeatureFlag } from '@island.is/react/feature-flags'

interface Props extends FieldBaseProps {
  field: PhoneField
}

export const PhoneFormField: FC<Props> = ({
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
        {isPhoneInputV2Enabled ? (
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
        ) : (
          <InputController
            disabled={disabled}
            readOnly={readOnly}
            id={`${id}NoV2`}
            dataTestId={dataTestId}
            type="tel"
            format="###-####"
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
        )}
      </Box>
    </div>
  )
}
