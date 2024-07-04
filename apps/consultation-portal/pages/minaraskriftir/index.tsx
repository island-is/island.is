import { QueryConsultationPortalGetCasesArgs } from '@island.is/api/schema'
import initApollo from '../../graphql/client'
import {
  ArrOfTypesForSubscriptions,
  CaseForSubscriptions,
} from '../../types/interfaces'
import {
  SUB_GET_CASES,
  SUB_GET_EMAIL,
  SUB_GET_TYPES,
} from '../../graphql/queries.graphql'
import {
  SubGetCasesQuery,
  SubGetEmailQuery,
  SubGetTypesQuery,
} from '../../graphql/queries.graphql.generated'
import UserSubscriptions from '../../screens/Subscriptions/UserSubscriptions'
import { SUB_PAGE_SIZE, SUB_STATUSES_TO_FETCH } from '../../utils/consts/consts'
import { withApollo } from '../../graphql/withApollo'
import { Error500 } from '../../components'
import { useLogIn } from '../../hooks'
import { getSession } from 'next-auth/client'
import { setContext } from '@apollo/client/link/context'

interface SubProps {
  cases: CaseForSubscriptions[]
  types: ArrOfTypesForSubscriptions
  isNotAuthorized?: boolean
  is500: boolean
}

export const getServerSideProps = async (ctx) => {
  const client = initApollo()
  const session = await getSession(ctx)

  if (session === null) {
    return {
      props: {
        cases: {},
        types: null,
        is500: false,
        isNotAuthorized: true,
      },
    }
  }

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
        is500: false,
      },
    }
  } catch (e) {
    console.error(e)
  }
  return {
    props: {
      cases: null,
      types: null,
      is500: true,
    },
  }
}

export const Index = ({ cases, types, is500, isNotAuthorized }: SubProps) => {
  const login = useLogIn()

  if (is500) return <Error500 />
  if (isNotAuthorized) login()
  else return <UserSubscriptions allcases={cases} types={types} />
  return <></>
}

export default withApollo(Index)
