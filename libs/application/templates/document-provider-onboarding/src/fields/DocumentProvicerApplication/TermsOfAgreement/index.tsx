import React, { FC } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import {
  FieldBaseProps,
  getValueViaPath,
  formatText,
} from '@island.is/application/core'
import {
  Accordion,
  AccordionItem,
  Box,
  Text,
  Checkbox,
} from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

import * as styles from './TermsOfAgreement.treat'
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

  const currentSecurityTerms = getValueViaPath(
    formValue,
    'termsOfAgreement.securityTerms' as string,
    false,
  ) as boolean

  const { setValue, errors, getValues } = useFormContext()

  console.log(currentUserTerms)

  return (
    <Box>
      <Box marginBottom={5}>
        <FieldDescription
          description={formatText(m.termsSubTitle, application, formatMessage)}
        />
      </Box>
      <Box marginBottom={3}>
        <Accordion singleExpand={false}>
          <AccordionItem
            id="id_1"
            label={formatText(
              m.termsUserAgreementTitle,
              application,
              formatMessage,
            )}
          >
            <Box paddingY={2} className={styles.maximumHeight}>
              <Text>
                {formatText(
                  m.termsUserAgreementMessage,
                  application,
                  formatMessage,
                )}
              </Text>
            </Box>
          </AccordionItem>
          <AccordionItem
            id="id_2"
            label={formatText(
              m.termsSafetyAgreementTitle,
              application,
              formatMessage,
            )}
          >
            <Box paddingY={2} className={styles.maximumHeight}>
              <Text>
                {formatText(
                  m.termsSafetyAgreementMessage,
                  application,
                  formatMessage,
                )}
              </Text>
            </Box>
          </AccordionItem>
        </Accordion>
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
                  errors['termsOfAgreement.userTerms'] &&
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
      <Box>
        <Controller
          name="termsOfAgreement.securityTerms"
          defaultValue={currentSecurityTerms}
          rules={{ required: true }}
          render={({ value, onChange }) => {
            return (
              <Checkbox
                onChange={(e) => {
                  onChange(e.target.checked)
                  setValue(
                    'termsOfAgreement.securityTerms' as string,
                    e.target.checked,
                  )
                }}
                checked={value}
                name="termsOfAgreement.securityTerms"
                hasError={
                  errors['termsOfAgreement.securityTerms'] &&
                  getValues('termsOfAgreement.securityTerms') === false
                }
                errorMessage={formatText(
                  m.termsSafetyAgreementRequiredMessage,
                  application,
                  formatMessage,
                )}
                label={formatText(
                  m.safetyAgreementOptionLabel,
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
