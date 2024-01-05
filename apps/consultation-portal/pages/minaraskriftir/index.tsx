import { QueryConsultationPortalGetCasesArgs } from '@island.is/api/schema'
import initApollo from '../../graphql/client'
import {
  ArrOfTypesForSubscriptions,
  CaseForSubscriptions,
} from '../../types/interfaces'
import { SUB_GET_CASES, SUB_GET_TYPES } from '../../graphql/queries.graphql'
import {
  SubGetCasesQuery,
  SubGetTypesQuery,
} from '../../graphql/queries.graphql.generated'
import UserSubscriptions from '../../screens/Subscriptions/UserSubscriptions'
import { SUB_PAGE_SIZE, SUB_STATUSES_TO_FETCH } from '../../utils/consts/consts'
import { withApollo } from '../../graphql/withApollo'

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
export default withApollo(Index)
