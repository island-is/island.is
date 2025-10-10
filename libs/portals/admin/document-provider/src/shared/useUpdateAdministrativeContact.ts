import React from 'react'
import { toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { gql, useMutation } from '@apollo/client'
import { m } from '../lib/messages'
import { ContactInput } from './useUpdateTechnicalContact'

const UPDATE_ADMINISTRATIVE_CONTACT_MUTATION = gql`
  mutation UpdateAdministrativeContactMutation(
    $organisationId: String!
    $administrativeContactId: String!
    $contact: UpdateContactInput!
  ) {
    updateAdministrativeContact(
      organisationId: $organisationId
      administrativeContactId: $administrativeContactId
      contact: $contact
    ) {
      name
      email
      phoneNumber
    }
  }
`

export const useUpdateAdministrativeContact = (organisationId: string) => {
  const [updateAdministrativeContactMutation, { called, loading, error }] =
    useMutation(UPDATE_ADMINISTRATIVE_CONTACT_MUTATION)

  const { formatMessage } = useLocale()
  const errorMsg = formatMessage(m.SingleProviderUpdateInformationError)
  const successMsg = formatMessage(m.SingleProviderUpdateInformationSuccess)
  React.useEffect(() => {
    if (!called) {
      return
    } else if (!loading && error) {
      toast.error(errorMsg)
    } else if (!loading) {
      toast.success(successMsg)
    }
  }, [called, loading, error, errorMsg, successMsg])

  const updateAdministrativeContact = (contactInput: ContactInput) => {
    const { id, ...contact } = contactInput
    updateAdministrativeContactMutation({
      variables: {
        organisationId,
        administrativeContactId: id,
        contact,
      },
    })
  }

  return {
    updateAdministrativeContact,
    loading,
  }
}
