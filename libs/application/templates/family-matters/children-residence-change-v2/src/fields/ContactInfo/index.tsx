import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Text, InputError } from '@island.is/island-ui/core'
import { getSelectedChildrenFromExternalData } from '@island.is/application/templates/family-matters-core/utils'
import {
  DescriptionText,
  InfoBanner,
  ContactInfoRow,
} from '@island.is/application/templates/family-matters-core/components'
import { contactInfo } from '../../lib/messages'
import { CRCFieldBaseProps } from '../../types'

const emailId = 'parentA.email'
const phoneNumberId = 'parentA.phoneNumber'
const phoneNumberPres = 'parentA.presentationPhone'

const counterPartyEmail = 'counterParty.email'
const counterPartyPhoneNumber = 'counterParty.phoneNumber'
const counterPartyPhoneNumberPres = 'counterParty.presentationPhone'

export const contactInfoIds = [
  emailId,
  phoneNumberId,
  counterPartyEmail,
  counterPartyPhoneNumber,
  phoneNumberPres,
  counterPartyPhoneNumberPres,
]

const ContactInfo = ({ errors, application }: CRCFieldBaseProps) => {
  const { answers, externalData } = application
  const { userProfile, nationalRegistry } = externalData
  const { formatMessage } = useIntl()
  const emailError = errors?.parentA?.email
  const phoneNumberError = errors?.parentA?.presentationPhone
  const counterPartyError =
    typeof errors?.counterParty === 'string' ? errors.counterParty : undefined
  const counterPartyEmailError = errors?.counterParty?.email
  const counterPartyPhoneError = errors?.counterParty?.presentationPhone
  const applicant = nationalRegistry.data
  const selectedChildren = getSelectedChildrenFromExternalData(
    externalData.childrenCustodyInformation.data,
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
            label: formatMessage(contactInfo.inputs.emailLabel),
            error: emailError,
            defaultValue: answers?.parentA?.email || userProfile?.data?.email,
          }}
          phoneNumber={{
            id: phoneNumberId,
            presentationId: phoneNumberPres,
            label: formatMessage(contactInfo.inputs.phoneNumberLabel),
            error: phoneNumberError,
            defaultValue:
              answers?.parentA?.phoneNumber ||
              userProfile?.data?.mobilePhoneNumber,
          }}
        />
      </Box>
      <Text marginTop={5} variant="h4">
        {selectedChildren[0]?.otherParent?.fullName}
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
            label: formatMessage(contactInfo.inputs.emailLabel),
            error: counterPartyError ? '' : counterPartyEmailError,
            clearErrors: [counterPartyEmail, 'counterParty'],
            defaultValue: answers?.counterParty?.email,
          }}
          phoneNumber={{
            id: counterPartyPhoneNumber,
            presentationId: counterPartyPhoneNumberPres,
            label: formatMessage(contactInfo.inputs.phoneNumberLabel),
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
