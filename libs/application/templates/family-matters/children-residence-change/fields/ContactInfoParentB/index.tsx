import React from 'react'
import { Box } from '@island.is/island-ui/core'
import { DescriptionText } from '@island.is/application/templates/family-matters/components'
import { contactInfo } from '../../lib/messages'
import { CRCFieldBaseProps } from '../../types'
import { ContactInfoRow } from '../components'

const emailId = 'parentB.email'
const phoneNumberId = 'parentB.phoneNumber'

export const contactInfoParentBIds = [emailId, phoneNumberId]

const ContactInfoParentB = ({ errors, application }: CRCFieldBaseProps) => {
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
            error: emailError,
            defaultValue: answers?.parentB?.email,
          }}
          phoneNumber={{
            id: phoneNumberId,
            error: phoneNumberError,
            defaultValue: answers?.parentB?.phoneNumber,
          }}
        />
      </Box>
    </>
  )
}

export default ContactInfoParentB
