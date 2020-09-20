import React, { FC } from 'react'
// import { gql, useMutation } from '@apollo/client'
import {
  ContactUs as ContactUsForm,
  ContactUsProps as ContactUsFormProps,
} from '@island.is/island-ui/contentful'

// const SUBMIT_QUERY = gql``

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ContactUsProps extends Omit<ContactUsFormProps, 'onSubmit'> {}

export const ContactUs: FC<ContactUsProps> = (props) => {
  // const [onSubmit] = useMutation(SUBMIT_QUERY)
  const onSubmit = async (values) => console.log(values)

  return <ContactUsForm {...props} onSubmit={onSubmit} />
}

export default ContactUs
