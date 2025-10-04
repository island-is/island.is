import React from 'react'
import { toast } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Helpdesk } from '@island.is/api/schema'
import { gql, useMutation } from '@apollo/client'
import { m } from '../lib/messages'
import { getOrganisationQuery } from '../shared/useGetOrganisation'

const CREATE_HELP_DESK_MUTATION = gql`
  mutation CreateHelpDeskMutation(
    $input: CreateHelpdeskInput!
    $organisationId: String!
  ) {
    createHelpdesk(input: $input, organisationId: $organisationId) {
      email
      phoneNumber
    }
  }
`

export type CreateHelpDeskInput = Pick<Helpdesk, 'email' | 'phoneNumber'>

export const useCreateHelpDesk = (
  organisationId: string,
  organisationNationalId: string,
) => {
  const [createHelpDeskMutation, { called, loading, error }] = useMutation(
    CREATE_HELP_DESK_MUTATION,
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

  const createHelpDesk = (input: CreateHelpDeskInput) => {
    createHelpDeskMutation({
      variables: {
        input,
        organisationId,
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
    createHelpDesk,
    loading,
  }
}
