import { Query } from '@island.is/api/schema'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'
import { GET_BROKEN_DOWN_ELECTRONIC_REGISTRATION_STATISTICS_QUERY } from '../queries/ElectronicRegistrations'

interface ElectronicRegistrationsProps {}

export const ElectronicRegistrations: Screen<ElectronicRegistrationsProps> = ({}) => {
  return <div></div>
}

ElectronicRegistrations.getInitialProps = async ({ apolloClient }) => {
  const [] = await Promise.all([
    apolloClient.query<Query>({
      query: GET_BROKEN_DOWN_ELECTRONIC_REGISTRATION_STATISTICS_QUERY,
      variables: { input: {} },
    }),
  ])

  return {}
}

export default withMainLayout(ElectronicRegistrations)
