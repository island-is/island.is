import React, { FC } from 'react'
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
        await submit({ variables: { input: formState } })
      }}
    />
  )
}

export default ContactUs
