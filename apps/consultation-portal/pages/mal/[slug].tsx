import { QueryConsultationPortalCaseByIdArgs } from '@island.is/api/schema'
import initApollo from '../../graphql/client'
import CaseScreen from '../../screens/Case/Case'
import { CASE_GET_CASE_BY_ID } from '../../graphql/queries.graphql'
import { CaseGetCaseByIdQuery } from '../../graphql/queries.graphql.generated'
import { ApolloExtraProps, Case } from '../../types/interfaces'
import { withApollo } from '../../graphql/withApollo'
import { Error404, Error500 } from '../../components'

interface CaseProps {
  case: Case & ApolloExtraProps
  caseId: number
  is500: boolean
}

const CaseDetails: React.FC<React.PropsWithChildren<CaseProps>> = ({
  case: Case,
  caseId,
  is500,
}: CaseProps) => {
  if (is500) return <Error500 />

  const { __typename, ...rest } = Case
  const isChosenCaseNull = Object.values(rest).every((value) => value === null)
  if (isChosenCaseNull) return <Error404 />

  return <CaseScreen chosenCase={rest} caseId={caseId} />
}
export default withApollo(CaseDetails)

export const getServerSideProps = async (ctx) => {
  const client = initApollo()
  try {
    const [
      {
        data: { consultationPortalCaseById },
      },
    ] = await Promise.all([
      client.query<CaseGetCaseByIdQuery, QueryConsultationPortalCaseByIdArgs>({
        query: CASE_GET_CASE_BY_ID,
        variables: {
          input: {
            caseId: parseInt(ctx.query['slug']),
          },
        },
      }),
    ])

    return {
      props: {
        case: consultationPortalCaseById,
        caseId: parseInt(ctx.query['slug']),
        is500: false,
      },
    }
  } catch (e) {
    console.error(e)
  }
  return {
    props: {
      case: null,
      caseId: null,
      is500: true,
    },
  }
}
