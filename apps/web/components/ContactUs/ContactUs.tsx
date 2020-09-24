import React, { FC } from 'react'
import {
  ContactUs as ContactUsForm,
  ContactUsProps as ContactUsFormProps,
} from '@island.is/island-ui/contentful'
import { CONTACT_US_MUTATION } from '@island.is/web/screens/queries'
import { useMutation } from 'react-apollo'

const getState = (data, loading, error) => {
  if (data?.contactUs?.success === true) return 'success'
  if (data?.contactUs?.success === false) return 'error'
  if (loading) return 'submitting'
  if (error) return 'error'
  return 'edit'
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ContactUsProps
  extends Omit<ContactUsFormProps, 'state' | 'onSubmit'> {}

export const ContactUs: FC<ContactUsProps> = (props) => {
  const [submit, { data, loading, error }] = useMutation(CONTACT_US_MUTATION)

  return (
    <ContactUsForm
      {...props}
      state={getState(data, loading, error)}
      onSubmit={async (formState) => {
        await submit({ variables: { input: formState } })
      }}
    />
  )
}

export default ContactUs
