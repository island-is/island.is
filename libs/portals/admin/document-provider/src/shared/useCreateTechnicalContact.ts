import React from 'react'
import { toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Contact } from '@island.is/api/schema'
import { gql, useMutation } from '@apollo/client'
import { m } from '../lib/messages'
import { getOrganisationQuery } from '../shared/useGetOrganisation'

const CREATE_TECHNICAL_CONTACT_MUTATION = gql`
  mutation CreateTechnicalContactMutation(
    $input: CreateContactInput!
    $organisationId: String!
  ) {
    createTechnicalContact(input: $input, organisationId: $organisationId) {
      name
      email
      phoneNumber
    }
  }
`

export type CreateContactInput = Pick<Contact, 'name' | 'email' | 'phoneNumber'>

export const useCreateTechnicalContact = (
  organisationId: string,
  organisationNationalId: string,
) => {
  const [createTechnicalContactMutation, { called, loading, error }] =
    useMutation(CREATE_TECHNICAL_CONTACT_MUTATION)

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

  const createTechnicalContact = (input: CreateContactInput) => {
    createTechnicalContactMutation({
      variables: {
        organisationId,
        input,
      },
      refetchQueries: [
        {
          query: getOrganisationQuery,
          variables: {
            input: organisationNationalId,
          },
        },
      ],
    })
  }

  return {
    createTechnicalContact,
    loading,
  }
}
