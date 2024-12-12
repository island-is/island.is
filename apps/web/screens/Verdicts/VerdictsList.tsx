import {
  GetVerdictsQuery,
  GetVerdictsQueryVariables,
} from '@island.is/web/graphql/schema'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'

import { GET_VERDICTS_QUERY } from '../queries/Verdicts'

interface VerdictsListProps {
  items: GetVerdictsQuery['webVerdicts']['items']
}

const VerdictsList: Screen<VerdictsListProps> = ({ items }) => {
  return <div>VerdictsList {JSON.stringify(items)}</div>
}

VerdictsList.getProps = async ({ apolloClient }) => {
  const verdictListResponse = await apolloClient.query<
    GetVerdictsQuery,
    GetVerdictsQueryVariables
  >({
    query: GET_VERDICTS_QUERY,
    variables: {
      input: {
        searchTerm: '',
      },
    },
  })

  console.log(verdictListResponse)

  return {
    items: verdictListResponse.data.webVerdicts.items,
  }
}

export default withMainLayout(VerdictsList)
