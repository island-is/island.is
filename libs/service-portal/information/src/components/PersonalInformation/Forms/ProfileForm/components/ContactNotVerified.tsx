import React, { useMemo } from 'react'

import { useLocale } from '@island.is/localization'
import { AlertMessage, Button } from '@island.is/island-ui/core'

import { msg } from '../../../../../lib/messages'

interface ContactNotVerifiedProps {
  contactType: 'email' | 'tel'
  onClick: () => void
}

export const ContactNotVerified = ({
  contactType,
  onClick,
}: ContactNotVerifiedProps) => {
  const { formatMessage } = useLocale()

  const contactTypeUpper = useMemo(
    () => formatMessage(msg[contactType]),
    [msg[contactType]],
  )
  const contactTypeLower = contactTypeUpper.toLowerCase()

  return (
    <AlertMessage
      type="warning"
      title={formatMessage(msg.contactNotVerified, {
        contactType: contactTypeUpper,
      })}
      message={formatMessage(msg.contactNotVerifiedDescription, {
        contactType: contactTypeLower,
      })}
      action={
        <Button variant="text" size="small" onClick={onClick}>
          {formatMessage(msg.confirmContact, {
            contactType: contactTypeLower,
          })}
        </Button>
      }
    />
  )
}
