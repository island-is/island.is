import React from 'react'
import { toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Organisation } from '@island.is/api/schema'
import { gql, useMutation } from '@apollo/client'
import { m } from '../lib/messages'

const UPDATE_ORGANISATION_MUTATION = gql`
  mutation UpdateOrganisationMutation(
    $id: String!
    $input: UpdateOrganisationInput!
  ) {
    updateOrganisation(id: $id, input: $input) {
      nationalId
      name
      address
      email
      phoneNumber
      zendeskId
    }
  }
`

export type OrganisationInput = Pick<
  Organisation,
  | 'id'
  | 'nationalId'
  | 'name'
  | 'address'
  | 'email'
  | 'phoneNumber'
  | 'zendeskId'
>

export type OnCompletedArgumentsType = {
  updateOrganisation: OrganisationInput
}

type OnCompletedFunctionType = (data: OnCompletedArgumentsType) => void

export const useUpdateOrganisation = (
  onCompleted?: OnCompletedFunctionType,
) => {
  const [updateOrganisationMutation, { called, loading, error }] = useMutation(
    UPDATE_ORGANISATION_MUTATION,
    { onCompleted },
  )

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

  const updateOrganisation = (organisationInput: OrganisationInput) => {
    const { id, ...input } = organisationInput
    updateOrganisationMutation({
      variables: {
        id,
        input,
      },
    })
  }

  return {
    updateOrganisation,
    loading,
  }
}
