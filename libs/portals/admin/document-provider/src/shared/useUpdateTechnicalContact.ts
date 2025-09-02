import React from 'react'
import { toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Contact } from '@island.is/api/schema'
import { gql, useMutation } from '@apollo/client'
import { m } from '../lib/messages'

const UPDATE_TECHNICAL_CONTACT_MUTATION = gql`
  mutation UpdateTechnicalContactMutation(
    $organisationId: String!
    $technicalContactId: String!
    $contact: UpdateContactInput!
  ) {
    updateTechnicalContact(
      organisationId: $organisationId
      technicalContactId: $technicalContactId
      contact: $contact
    ) {
      name
      email
      phoneNumber
    }
  }
`

export type ContactInput = Pick<
  Contact,
  'id' | 'name' | 'email' | 'phoneNumber'
>

export const useUpdateTechnicalContact = (organisationId: string) => {
  const [updateTechnicalContactMutation, { called, loading, error }] =
    useMutation(UPDATE_TECHNICAL_CONTACT_MUTATION)

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

  const updateTechnicalContact = (contactInput: ContactInput) => {
    const { id, ...contact } = contactInput
    updateTechnicalContactMutation({
      variables: {
        organisationId,
        technicalContactId: id,
        contact,
      },
    })
  }

  return {
    updateTechnicalContact,
    loading,
  }
}
