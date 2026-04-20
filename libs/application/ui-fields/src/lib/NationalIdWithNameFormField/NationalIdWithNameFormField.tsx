import { FC } from 'react'
import {
  buildFieldRequired,
  formatTextWithLocale,
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

interface Props extends FieldBaseProps {
  field: NationalIdWithNameField
}

export const NationalIdWithNameFormField: FC<
  React.PropsWithChildren<Props>
> = ({ application, field, error }) => {
  const { formatMessage, lang: locale } = useLocale()

  return (
    <Box marginTop={field.marginTop} marginBottom={field.marginBottom}>
      {field.title && (
        <Text variant={field.titleVariant ?? 'h3'} marginBottom={2}>
          {formatTextWithLocale(
            field.title,
            application,
            locale as Locale,
            formatMessage,
          )}
        </Text>
      )}
      {field.description && (
        <FieldDescription
          description={formatTextWithLocale(
            field.description,
            application,
            locale as Locale,
            formatMessage,
          )}
        />
      )}
      <NationalIdWithName
        id={field.id}
        application={application}
        disabled={field.disabled}
        required={buildFieldRequired(application, field.required)}
        customNationalIdLabel={field.customNationalIdLabel}
        customNameLabel={field.customNameLabel}
        onNationalIdChange={field.onNationalIdChange}
        onNameChange={field.onNameChange}
        nationalIdDefaultValue={field.nationalIdDefaultValue}
        nameDefaultValue={field.nameDefaultValue}
        errorMessage={field.errorMessage}
        minAgePerson={field.minAgePerson}
        searchPersons={field.searchPersons}
        searchCompanies={field.searchCompanies}
        showPhoneField={field.showPhoneField}
        showEmailField={field.showEmailField}
        phoneRequired={field.phoneRequired}
        emailRequired={field.emailRequired}
        phoneLabel={field.phoneLabel}
        emailLabel={field.emailLabel}
        error={error}
        clearOnChange={field.clearOnChange}
        clearOnChangeDefaultValue={field.clearOnChangeDefaultValue}
        setOnChange={async (optionValue) => {
          if (typeof field.setOnChange === 'function')
            return await field.setOnChange(optionValue, application)
          else if (field.setOnChange) return field.setOnChange
          return []
        }}
      />
    </Box>
  )
}
