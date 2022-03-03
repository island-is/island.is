import React from 'react'
import { MutationResult, useMutation } from '@apollo/client/react'

import {
  ContactUs as ContactUsForm,
  ContactUsProps as ContactUsFormProps,
} from '@island.is/island-ui/contentful'
import {
  ContactUsZendeskTicketMutation,
  ContactUsZendeskTicketMutationVariables,
} from '@island.is/web/graphql/schema'
import { CONTACT_US_ZENDESK_TICKET_MUTATION } from '@island.is/web/screens/queries'

const getState = (
  data: MutationResult<ContactUsZendeskTicketMutation>['data'],
  loading: MutationResult['loading'],
  error: MutationResult['error'],
) => {
  if (data?.contactUsZendeskTicket?.sent === true) return 'success'
  if (data?.contactUsZendeskTicket?.sent === false) return 'error'
  if (loading) return 'submitting'
  if (error) return 'error'
  return 'edit'
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ContactUsProps
  extends Omit<ContactUsFormProps, 'state' | 'onSubmit'> {}

export const ContactUs = (props: ContactUsProps) => {
  const [submit, { data, loading, error }] = useMutation<
    ContactUsZendeskTicketMutation,
    ContactUsZendeskTicketMutationVariables
  >(CONTACT_US_ZENDESK_TICKET_MUTATION)
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
