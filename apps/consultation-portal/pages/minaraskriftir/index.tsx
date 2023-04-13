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
import UserSubscriptions from '../../screens/UserSubscriptions/UserSubscriptions'

const STATUSES_TO_FETCH = [1, 2, 3]

interface SubProps {
  subscriptions: CaseForSubscriptions[]
  types: ArrOfTypesForSubscriptions
}

export const getServerSideProps = async (ctx) => {
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
            caseStatuses: STATUSES_TO_FETCH,
          },
        },
      }),
      client.query<SubGetTypesQuery>({
        query: SUB_GET_TYPES,
      }),
    ])
    return {
      props: {
        subscriptions: consultationPortalGetCases.cases,
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
}
export const Index = ({ subscriptions, types }: SubProps) => {
  return <UserSubscriptions subscriptions={subscriptions} types={types} />
}
export default Index
