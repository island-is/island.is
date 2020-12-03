import React, { FC } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import {
  Accordion,
  AccordionItem,
  Box,
  Text,
  Checkbox,
} from '@island.is/island-ui/core'

import * as styles from './TermsOfAgreement.treat'

import { FieldDescription } from '@island.is/shared/form-fields'

import { m } from '../../../forms/messages'

//TODO: Finish error messages.
const TermsOfAgreement: FC<FieldBaseProps> = ({ application }) => {
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

  const { setValue } = useFormContext()

  return (
    <Box>
      <Box marginBottom={5}>
        <FieldDescription description={m.termsSubTitle.defaultMessage} />
      </Box>
      <Box marginBottom={3}>
        <Accordion singleExpand={false}>
          <AccordionItem
            id="id_1"
            label={m.termsUserAgreementTitle.defaultMessage}
          >
            <Box paddingY={2} className={styles.maximumHeight}>
              <Text>{m.termsUserAgreementMessage.defaultMessage}</Text>
            </Box>
          </AccordionItem>
          <AccordionItem
            id="id_2"
            label={m.termsSafetyAgreementTitle.defaultMessage}
          >
            <Box paddingY={2} className={styles.maximumHeight}>
              <Text>{m.termsSafetyAgreementMessage.defaultMessage}</Text>
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
                label={m.userAgreementOptionLabel.defaultMessage}
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
                label={m.safetyAgreementOptionLabel.defaultMessage}
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
