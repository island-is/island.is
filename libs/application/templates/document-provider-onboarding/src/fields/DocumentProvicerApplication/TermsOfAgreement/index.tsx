import React, { FC } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import {
  getValueViaPath,
  formatText,
  getErrorViaPath,
} from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Checkbox, Button, Link } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

import { m } from '../../../forms/messages'

//TODO: Finish error messages.
const TermsOfAgreement: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  const { answers: formValue } = application
  const currentUserTerms = getValueViaPath(
    formValue,
    'termsOfAgreement.userTerms' as string,
    false,
  ) as boolean

  const { setValue, formState, getValues } = useFormContext()
  const { errors } = formState

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
          render={({ field: { value, onChange } }) => {
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
                  errors &&
                  getErrorViaPath(errors, 'termsOfAgreement.userTerms') !==
                    undefined
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
