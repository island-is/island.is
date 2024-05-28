import gql from 'graphql-tag'
import { ApplicationFilters } from '../../types/filters'
import * as Apollo from '@apollo/client'

type Props = {
  type: Array<string>
  period: ApplicationFilters['period']
}

export const fetchAllApplications = async ({ type, period }: Props) => {
  const res = await Apollo.useQuery(
    gql`
      query getApplications($input: input) {
        applications(input: $input) {
          id
          name
          type
          status
          created
        }
      }
    `,
    { variables: { input: { type, period } } },
  )
}

export const applicationApplications = async () => {
  const query = gql`
    query applicationAppliaction($input: ApplicationApplicationsInput!) {
      applicationApplications(input: $input) {
        id
      }
    }
  `

  const variables = {
    input: {
      typeId: ['AccidentNotification'],
      status: ['draft'],
      scopeCheck: false,
    },
  }

  console.log('Að fara að keyra query...')
  const res = await Apollo.useQuery(query, { variables })
  console.log(res)
}
