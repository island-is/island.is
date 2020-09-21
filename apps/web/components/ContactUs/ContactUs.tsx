import React, { FC } from 'react'
import {
  ContactUs as ContactUsForm,
  ContactUsProps as ContactUsFormProps,
} from '@island.is/island-ui/contentful'
import { DELIVER_CONTACT_US } from '@island.is/web/screens/queries'
import { useMutation } from 'react-apollo'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ContactUsProps
  extends Omit<ContactUsFormProps, 'hasError' | 'onSubmit'> {}

export const ContactUs: FC<ContactUsProps> = (props) => {
  const [submit, { error }] = useMutation(DELIVER_CONTACT_US)

  return (
    <ContactUsForm
      {...props}
      hasError={Boolean(error)}
      onSubmit={async (formState) => {
        await submit({ variables: { input: formState } })
      }}
    />
  )
}

export default ContactUs
