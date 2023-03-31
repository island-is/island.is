import initApollo from '../../graphql/client'
import SubscriptionScreen from '../../screens/Subscriptions/Subscriptions'
import {
  ArrOfTypesForSubscriptions,
  CaseForSubscriptions,
} from '../../types/interfaces'
import { QueryConsultationPortalGetCasesArgs } from '@island.is/api/schema'
import {
  GET_CASES,
  GET_TYPES,
} from '../../screens/Subscriptions/queries.graphql'
import {
  ConsultationPortalGetCasesQuery,
  ConsultationPortalAllTypesQuery,
} from '../../screens/Subscriptions/queries.graphql.generated'

const STATUSES_TO_FETCH = [1, 2, 3]
const PAGE_SIZE = 2000

interface SubProps {
  cases: CaseForSubscriptions[]
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
      client.query<
        ConsultationPortalGetCasesQuery,
        QueryConsultationPortalGetCasesArgs
      >({
        query: GET_CASES,
        variables: {
          input: {
            caseStatuses: STATUSES_TO_FETCH,
            // pageSize: PAGE_SIZE,
          },
        },
      }),
      client.query<ConsultationPortalAllTypesQuery>({
        query: GET_TYPES,
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
}
export const Index = ({ cases, types }: SubProps) => {
  return <SubscriptionScreen cases={cases} types={types} />
}
export default Index
