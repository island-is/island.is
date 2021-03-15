import React, { FC } from 'react'
import axios from 'axios'
import {
  ContactUs as ContactUsForm,
  ContactUsProps as ContactUsFormProps,
} from '@island.is/island-ui/contentful'
import { CONTACT_US_MUTATION } from '@island.is/web/screens/queries'
import { MutationResult, useMutation } from '@apollo/client/react'
import {
  ContactUsMutation,
  ContactUsMutationVariables,
} from '@island.is/web/graphql/schema'

const getState = (
  data: MutationResult<ContactUsMutation>['data'],
  loading: MutationResult['loading'],
  error: MutationResult['error'],
) => {
  if (data?.contactUs?.sent === true) return 'success'
  if (data?.contactUs?.sent === false) return 'error'
  if (loading) return 'submitting'
  if (error) return 'error'
  return 'edit'
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ContactUsProps
  extends Omit<ContactUsFormProps, 'state' | 'onSubmit'> {}

const createZendeskTicket = async (subject: string, body: string) => {
  const response = await axios.post(
    '/next-api/zendesk/ticket',
    {
      subject,
      body,
    },
    { headers: { 'Content-Type': 'application/json' } },
  )

  console.log('response', response)
}

export const ContactUs: FC<ContactUsProps> = (props) => {
  const [submit, { data, loading, error }] = useMutation<
    ContactUsMutation,
    ContactUsMutationVariables
  >(CONTACT_US_MUTATION)
  return (
    <ContactUsForm
      {...props}
      state={getState(data, loading, error)}
      onSubmit={async (formState) => {
        console.log('formState', formState)
        await createZendeskTicket(
          formState.subject ?? '',
          formState.message ?? '',
        )
      }}
    />
  )
}

export default ContactUs
