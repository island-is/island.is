import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Text, InputError } from '@island.is/island-ui/core'
import { getSelectedChildrenFromExternalData } from '@island.is/application/templates/family-matters/utils'
import { contactInfo } from '../../lib/messages'
import { CRCFieldBaseProps } from '../../types'
import { ContactInfoRow, DescriptionText, InfoBanner } from '../components'

const emailId = 'parentA.email'
const phoneNumberId = 'parentA.phoneNumber'

const counterPartyEmail = 'counterParty.email'
const counterPartyPhoneNumber = 'counterParty.phoneNumber'

export const contactInfoIds = [
  emailId,
  phoneNumberId,
  counterPartyEmail,
  counterPartyPhoneNumber,
]

const ContactInfo = ({ errors, application }: CRCFieldBaseProps) => {
  const { answers, externalData } = application
  const { userProfile, nationalRegistry } = externalData
  const { formatMessage } = useIntl()
  const emailError = errors?.parentA?.email
  const phoneNumberError = errors?.parentA?.phoneNumber
  const counterPartyError =
    typeof errors?.counterParty === 'string' ? errors.counterParty : undefined
  const counterPartyEmailError = errors?.counterParty?.email
  const counterPartyPhoneError = errors?.counterParty?.phoneNumber
  const applicant = nationalRegistry.data
  const selectedChildren = getSelectedChildrenFromExternalData(
    applicant.children,
    answers.selectedChildren,
  )

  return (
    <>
      <Box marginTop={3}>
        <DescriptionText text={contactInfo.general.description} />
      </Box>
      <Text marginTop={5} variant="h4">
        {applicant.fullName}
      </Text>
      <Box marginTop={2}>
        <ContactInfoRow
          email={{
            id: emailId,
            error: emailError,
            defaultValue: answers?.parentA?.email || userProfile?.data?.email,
          }}
          phoneNumber={{
            id: phoneNumberId,
            error: phoneNumberError,
            defaultValue:
              answers?.parentA?.phoneNumber ||
              userProfile?.data?.mobilePhoneNumber,
          }}
        />
      </Box>
      <Text marginTop={5} variant="h4">
        {selectedChildren[0].otherParent.fullName}
      </Text>
      <Box marginTop={2}>
        <InfoBanner>
          <Text variant="small">
            {formatMessage(contactInfo.counterParty.info)}
          </Text>
        </InfoBanner>
      </Box>
      <Box marginTop={3}>
        <ContactInfoRow
          email={{
            id: counterPartyEmail,
            error: counterPartyError ? '' : counterPartyEmailError,
            clearErrors: [counterPartyEmail, 'counterParty'],
            defaultValue: answers?.counterParty?.email,
          }}
          phoneNumber={{
            id: counterPartyPhoneNumber,
            error: counterPartyError ? '' : counterPartyPhoneError,
            clearErrors: [counterPartyPhoneNumber, 'counterParty'],
            defaultValue: answers?.counterParty?.phoneNumber,
          }}
        />
        {counterPartyError && (
          <InputError
            id={`${counterPartyEmail}-error`}
            errorMessage={counterPartyError}
          />
        )}
      </Box>
    </>
  )
}

export default ContactInfo
