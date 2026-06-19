import { FC } from 'react'
import {
  buildFieldRequired,
  formatTextWithLocale,
  resolveFieldClearOnChange,
  resolveFieldId,
} from '@island.is/application/core'
import {
  FieldBaseProps,
  NationalIdWithNameField,
} from '@island.is/application/types'
import { NationalIdWithName } from '@island.is/application/ui-components'
import { Box, Text } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { Locale } from '@island.is/shared/types'
import { useLocale } from '@island.is/localization'
import { useUserInfo } from '@island.is/react-spa/bff'

interface Props extends FieldBaseProps {
  field: NationalIdWithNameField
}

export const NationalIdWithNameFormField: FC<
  React.PropsWithChildren<Props>
> = ({ application, field, error }) => {
  const { formatMessage, lang: locale } = useLocale()
  const user = useUserInfo()
  const {
    id,
    title,
    description,
    titleVariant,
    marginTop,
    marginBottom,
    disabled,
    required,
    customNationalIdLabel,
    customNameLabel,
    onNationalIdChange,
    onNameChange,
    nationalIdDefaultValue,
    nameDefaultValue,
    errorMessage,
    minAgePerson,
    searchPersons,
    searchCompanies,
    showPhoneField,
    showEmailField,
    phoneRequired,
    emailRequired,
    phoneLabel,
    emailLabel,
    clearOnChange,
    clearOnChangeDefaultValue,
    setOnChange,
  } = field
  const resolvedId = resolveFieldId({ id }, application, user)

  return (
    <Box marginTop={marginTop} marginBottom={marginBottom}>
      {title && (
        <Text variant={titleVariant ?? 'h3'} marginBottom={2}>
          {formatTextWithLocale(
            title,
            application,
            locale as Locale,
            formatMessage,
          )}
        </Text>
      )}
      {description && (
        <FieldDescription
          description={formatTextWithLocale(
            description,
            application,
            locale as Locale,
            formatMessage,
          )}
        />
      )}
      <NationalIdWithName
        id={resolvedId}
        application={application}
        disabled={disabled}
        required={buildFieldRequired(application, required)}
        customNationalIdLabel={customNationalIdLabel}
        customNameLabel={customNameLabel}
        onNationalIdChange={onNationalIdChange}
        onNameChange={onNameChange}
        nationalIdDefaultValue={nationalIdDefaultValue}
        nameDefaultValue={nameDefaultValue}
        errorMessage={errorMessage}
        minAgePerson={minAgePerson}
        searchPersons={searchPersons}
        searchCompanies={searchCompanies}
        showPhoneField={showPhoneField}
        showEmailField={showEmailField}
        phoneRequired={phoneRequired}
        emailRequired={emailRequired}
        phoneLabel={phoneLabel}
        emailLabel={emailLabel}
        error={error}
        clearOnChange={resolveFieldClearOnChange(
          { clearOnChange },
          application,
        )}
        clearOnChangeDefaultValue={clearOnChangeDefaultValue}
        setOnChange={async (optionValue) => {
          if (typeof setOnChange === 'function')
            return await setOnChange(optionValue, application)
          else if (setOnChange) return setOnChange
          return []
        }}
      />
    </Box>
  )
}
