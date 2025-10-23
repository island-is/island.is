import React from 'react'
import { toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { gql, useMutation } from '@apollo/client'
import { m } from '../lib/messages'
import { CreateContactInput } from './useCreateTechnicalContact'
import { getOrganisationQuery } from '../shared/useGetOrganisation'

const CREATE_ADMINISTRATIVE_CONTACT_MUTATION = gql`
  mutation createAdministrativeContactMutation(
    $input: CreateContactInput!
    $organisationId: String!
  ) {
    createAdministrativeContact(
      input: $input
      organisationId: $organisationId
    ) {
      name
      email
      phoneNumber
    }
  }
`

export const useCreateAdministrativeContact = (
  organisationId: string,
  organisationNationalId: string,
) => {
  const [createAdministrativeContactMutation, { called, loading, error }] =
    useMutation(CREATE_ADMINISTRATIVE_CONTACT_MUTATION)

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

  const createAdministrativeContact = (input: CreateContactInput) => {
    createAdministrativeContactMutation({
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
    createAdministrativeContact,
    loading,
  }
}
