import React, { FC } from 'react'
import { Controller,useFormContext } from 'react-hook-form'

import {
  FieldBaseProps,
  formatText,
  getValueViaPath,
} from '@island.is/application/core'
import { Box, Button, Checkbox, Link } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldDescription } from '@island.is/shared/form-fields'

import { m } from '../../../forms/messages'

//TODO: Finish error messages.
const TermsOfAgreement: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { answers: formValue } = application
  const currentUserTerms = getValueViaPath(
    formValue,
    'termsOfAgreement.userTerms' as string,
    false,
  ) as boolean

  const { setValue, errors, getValues } = useFormContext()

  return (
    <Box>
      <Box marginBottom={5}>
        <FieldDescription
          description={formatText(m.termsSubTitle, application, formatMessage)}
        />
      </Box>
      <Box marginBottom={3}>
        <Box>
          <Box background="blue100" padding={3} borderRadius="large">
            <Link
              href={formatText(
                m.termsUserAgreementUrl,
                application,
                formatMessage,
              )}
            >
              <Button icon="open" iconType="outline" variant="text">
                {formatText(
                  m.termsUserAgreementTitle,
                  application,
                  formatMessage,
                )}
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>
      <Box marginBottom={1}>
        <Controller
          name="termsOfAgreement.userTerms"
          defaultValue={currentUserTerms}
          rules={{ required: true }}
          render={({ value, onChange }) => {
            return (
              <Checkbox
                onChange={(e) => {
                  onChange(e.target.checked)
                  setValue(
                    'termsOfAgreement.userTerms' as string,
                    e.target.checked,
                  )
                }}
                checked={value}
                name="termsOfAgreement.userTerms"
                hasError={
                  errors?.termsOfAgreement?.userTerms &&
                  getValues('termsOfAgreement.userTerms') === false
                }
                errorMessage={formatText(
                  m.termsUserAgreementRequiredMessage,
                  application,
                  formatMessage,
                )}
                label={formatText(
                  m.userAgreementOptionLabel,
                  application,
                  formatMessage,
                )}
                large
              />
            )
          }}
        />
      </Box>
    </Box>
  )
}

export default TermsOfAgreement
