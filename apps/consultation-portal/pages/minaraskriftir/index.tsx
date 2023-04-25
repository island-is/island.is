import initApollo from '../../graphql/client'
import {
  ArrOfTypesForSubscriptions,
  CaseForSubscriptions,
} from '../../types/interfaces'
import { QueryConsultationPortalGetCasesArgs } from '@island.is/api/schema'
import {
  SUB_GET_CASES,
  SUB_GET_TYPES,
  SUB_GET_USERSUBS,
} from '../../graphql/queries.graphql'
import {
  SubGetCasesQuery,
  SubGetTypesQuery,
  SubGetUsersubsQuery,
} from '../../graphql/queries.graphql.generated'
import UserSubscriptions from '../../screens/UserSubscriptions/UserSubscriptions'

const STATUSES_TO_FETCH = [1, 2, 3]

interface SubProps {
  cases: CaseForSubscriptions[]
  types: ArrOfTypesForSubscriptions
  isNotAuthorized?: boolean
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
        cases: consultationPortalGetCases.cases,
        types: consultationPortalAllTypes,
      },
    }
  } catch (e) {
    console.error(e)
    if (e.message === 'Unauthorized') {
      return {
        props: {
          cases: {},
          subscriptions: {},
          types: null,
          isNotAuthorized: true,
        },
      }
    }
  }
  return {
    redirect: {
      destination: '/500',
    },
  }
}
export const Index = ({ cases, types, isNotAuthorized }: SubProps) => {
  return (
    <UserSubscriptions
      allcases={cases}
      types={types}
      isNotAuthorized={isNotAuthorized}
    />
  )
}
export default Index
