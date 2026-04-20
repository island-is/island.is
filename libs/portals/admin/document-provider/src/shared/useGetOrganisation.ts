import { useEffect } from 'react'
import { toast } from '@island.is/island-ui/core'
import { gql, useQuery } from '@apollo/client'
import { Organisation } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'

export const getOrganisationQuery = gql`
  query GetOrganisationQuery($input: String!) {
    getProviderOrganisation(nationalId: $input) {
      id
      nationalId
      name
      address
      email
      phoneNumber
      zendeskId
      administrativeContact {
        id
        name
        email
        phoneNumber
      }
      technicalContact {
        id
        name
        email
        phoneNumber
      }
      helpdesk {
        id
        email
        phoneNumber
      }
    }
  }
`

type GetOrganisationsReturnType = {
  organisation: Organisation
  loading: boolean
}

export const useGetOrganisation = (
  nationalId: string,
): GetOrganisationsReturnType => {
  const { data, loading, error } = useQuery(getOrganisationQuery, {
    variables: {
      input: nationalId,
    },
    fetchPolicy: 'network-only',
  })

  const { formatMessage } = useLocale()
  useEffect(() => {
    if (!loading && error) {
      toast.error(
        `${formatMessage(m.SingleProviderGetOrganisationError)} ${nationalId}`,
      )
    }
  }, [error, loading, nationalId, formatMessage])

  return {
    organisation: data?.getProviderOrganisation,
    loading,
  }
}
