import React, { FC } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import {
  FieldBaseProps,
  getValueViaPath,
  formatText,
} from '@island.is/application/core'
import { Box, Checkbox, Button, Link } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { terms, errorMessages } from '../../lib/messages'

export const TermsOfAgreement: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { answers: formValue } = application
  const termsAgreement = getValueViaPath(
    formValue,
    'termsOfAgreement' as string,
    false,
  ) as boolean

  const { setValue, errors, getValues } = useFormContext()

  return (
    <>
      <Box marginBottom={3}>
        <FieldDescription
          description={formatText(
            terms.general.pageDescription,
            application,
            formatMessage,
          )}
        />
      </Box>
      <Box background="blue100" padding={3} borderRadius="large">
        <Link
          href={formatText(
            terms.values.termsAgreementUrl,
            application,
            formatMessage,
          )}
        >
          <Button icon="open" iconType="outline" variant="text">
            {formatText(
              terms.labels.termsAgreementLinkTitle,
              application,
              formatMessage,
            )}
          </Button>
        </Link>
      </Box>
      <Box marginTop={5}>
        <Controller
          name="termsOfAgreement"
          defaultValue={termsAgreement}
          rules={{ required: true }}
          render={({ value, onChange }) => {
            return (
              <Checkbox
                onChange={(e) => {
                  onChange(e.target.checked)
                  setValue('termsOfAgreement' as string, e.target.checked)
                }}
                checked={value}
                name="termsOfAgreement"
                hasError={
                  errors?.termsOfAgreement &&
                  getValues('termsOfAgreement') === false
                }
                errorMessage={formatText(
                  errorMessages.termsAgreementRequired,
                  application,
                  formatMessage,
                )}
                label={formatText(
                  terms.labels.termsAgreementApproval,
                  application,
                  formatMessage,
                )}
                large
              />
            )
          }}
        />
      </Box>
    </>
  )
}
