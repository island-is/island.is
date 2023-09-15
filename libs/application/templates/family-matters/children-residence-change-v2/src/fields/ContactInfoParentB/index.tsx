import React from 'react'
import { useIntl } from 'react-intl'
import { Box } from '@island.is/island-ui/core'
import {
  DescriptionText,
  ContactInfoRow,
} from '@island.is/application/templates/family-matters-core/components'
import { contactInfo } from '../../lib/messages'
import { CRCFieldBaseProps } from '../../types'

const emailId = 'parentB.email'
const phoneNumberId = 'parentB.phoneNumber'
const phoneNumberPres = 'parentB.presentationPhone'

export const contactInfoParentBIds = [emailId, phoneNumberId, phoneNumberPres]

const ContactInfoParentB = ({ errors, application }: CRCFieldBaseProps) => {
  const { formatMessage } = useIntl()
  const { answers } = application
  const emailError = errors?.parentB?.email
  const phoneNumberError = errors?.parentB?.phoneNumber

  return (
    <>
      <Box marginTop={3}>
        <DescriptionText text={contactInfo.general.parentBDescription} />
      </Box>
      <Box marginTop={5}>
        <ContactInfoRow
          email={{
            id: emailId,
            label: formatMessage(contactInfo.inputs.emailLabel),
            error: emailError,
            defaultValue: answers?.counterParty?.email,
          }}
          phoneNumber={{
            id: phoneNumberId,
            presentationId: phoneNumberPres,
            label: formatMessage(contactInfo.inputs.phoneNumberLabel),
            error: phoneNumberError,
            defaultValue: answers?.counterParty?.phoneNumber,
          }}
        />
      </Box>
    </>
  )
}

export default ContactInfoParentB
