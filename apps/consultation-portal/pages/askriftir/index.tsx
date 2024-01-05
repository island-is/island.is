import { getSession } from 'next-auth/client'
import initApollo from '../../graphql/client'
import SubscriptionScreen from '../../screens/Subscriptions/Subscriptions'
import {
  ArrOfTypesForSubscriptions,
  CaseForSubscriptions,
} from '../../types/interfaces'
import { QueryConsultationPortalGetCasesArgs } from '@island.is/api/schema'
import { SUB_GET_CASES, SUB_GET_TYPES } from '../../graphql/queries.graphql'
import {
  SubGetCasesQuery,
  SubGetTypesQuery,
} from '../../graphql/queries.graphql.generated'
import { SUB_PAGE_SIZE, SUB_STATUSES_TO_FETCH } from '../../utils/consts/consts'
import { withApollo } from '../../graphql/withApollo'

interface SubProps {
  cases: CaseForSubscriptions[]
  types: ArrOfTypesForSubscriptions
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  if (session) {
    const client = initApollo()
    try {
      const [
        {
          data: { consultationPortalGetCases },
        },
        {
          data: { consultationPortalAllTypes },
        },
      ] = await Promise.all([
        client.query<SubGetCasesQuery, QueryConsultationPortalGetCasesArgs>({
          query: SUB_GET_CASES,
          variables: {
            input: {
              caseStatuses: SUB_STATUSES_TO_FETCH,
              pageSize: SUB_PAGE_SIZE,
            },
          },
        }),
        client.query<SubGetTypesQuery>({
          query: SUB_GET_TYPES,
        }),
      ])
      return {
        props: {
          cases: consultationPortalGetCases.cases,
          types: consultationPortalAllTypes,
        },
      }
    } catch (e) {
      console.error(e)
    }
    return {
      redirect: {
        destination: '/500',
      },
    }
  } else {
    return {
      props: {
        cases: [],
        types: { policyAreas: {}, institutions: {} },
      },
    }
  }
}
export const Index = ({ cases, types }: SubProps) => {
  return <SubscriptionScreen cases={cases} types={types} />
}
export default withApollo(Index)
