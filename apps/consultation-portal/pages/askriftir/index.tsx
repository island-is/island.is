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
  ConsultationPortalAllCasesQuery,
  ConsultationPortalAllTypesQuery,
} from '../../screens/Subscriptions/queries.graphql.generated'

const STATUSES_TO_FETCH = [1, 2, 3]

interface SubProps {
  cases: CaseForSubscriptions[]
  types: ArrOfTypesForSubscriptions
}

export const getServerSideProps = async (ctx) => {
  const client = initApollo()
  const [
    {
      data: { consultationPortalAllCases },
    },
    {
      data: { consultationPortalAllTypes },
    },
  ] = await Promise.all([
    client.query<
      ConsultationPortalAllCasesQuery,
      QueryConsultationPortalGetCasesArgs
    >({
      query: GET_CASES,
      variables: {
        input: {
          caseStatuses: STATUSES_TO_FETCH,
        },
      },
    }),
    client.query<ConsultationPortalAllTypesQuery>({
      query: GET_TYPES,
    }),
  ])
  return {
    props: {
      cases: consultationPortalAllCases,
      types: consultationPortalAllTypes,
    },
  }
}
export const Index = ({ cases, types }: SubProps) => {
  return <SubscriptionScreen cases={cases} types={types} />
}
export default Index
