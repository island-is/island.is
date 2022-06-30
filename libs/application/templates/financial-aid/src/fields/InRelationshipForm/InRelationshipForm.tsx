import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { FAFieldBaseProps } from '../../lib/types'
import {
  CheckboxController,
  InputController,
} from '@island.is/shared/form-fields'
import { useIntl } from 'react-intl'
import { inRelationship } from '../../lib/messages'
import DescriptionText from '../DescriptionText/DescriptionText'
import { useFormContext } from 'react-hook-form'

const spouseEmail = 'spouse.email'
const spouseApproveTerms = 'spouse.approveTerms'

const InRelationshipForm = ({ errors, application }: FAFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { answers } = application
  const { clearErrors } = useFormContext()
  const spouseEmailError = errors?.spouse?.email
  const spouseApproveTermsError = errors?.spouse?.approveTerms

  return (
    <div>
      <Text variant="intro" marginBottom={[2, 2, 3]} marginTop={2}>
        {formatMessage(inRelationship.general.intro)}
      </Text>
      <Box marginBottom={[3, 3, 4]}>
        <DescriptionText text={inRelationship.general.description} />
      </Box>
      <Box marginBottom={[5, 5, 10]}>
        <Box marginBottom={[2, 2, 3]}>
          <InputController
            id={spouseEmail}
            name={spouseEmail}
            backgroundColor="blue"
            type="email"
            placeholder={formatMessage(inRelationship.inputs.spouseEmail)}
            label={formatMessage(inRelationship.inputs.spouseEmail)}
            error={spouseEmailError}
            defaultValue={answers.spouse?.email || ''}
            onChange={() => {
              clearErrors(spouseEmailError)
            }}
          />
        </Box>
        <CheckboxController
          id={spouseApproveTerms}
          name={spouseApproveTerms}
          backgroundColor="blue"
          large={true}
          defaultValue={[]}
          error={spouseApproveTermsError}
          options={[
            {
              value: 'yes',
              label: formatMessage(inRelationship.inputs.checkboxLabel),
            },
          ]}
        />
      </Box>
    </div>
  )
}

export default InRelationshipForm
