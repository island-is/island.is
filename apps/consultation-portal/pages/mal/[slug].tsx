import { QueryConsultationPortalCaseByIdArgs } from '@island.is/api/schema'
import initApollo from '../../graphql/client'
import CaseScreen from '../../screens/Case/Case'
import {
  CASE_GET_CASE_BY_ID,
  CASE_GET_ADVICES_BY_ID,
} from '../../graphql/queries.graphql'
import {
  CaseGetCaseByIdQuery,
  CaseGetAdvicesByIdQuery,
  CaseGetAdvicesByIdQueryVariables,
} from '../../graphql/queries.graphql.generated'
import { Advice, Case } from '../../types/viewModels'
interface CaseProps {
  case: Case
  advices: Advice[]
}

const CaseDetails: React.FC<CaseProps> = ({
  case: Case,
  advices,
}: CaseProps) => {
  return <CaseScreen chosenCase={Case} advices={advices} />
}
export default CaseDetails

export const getServerSideProps = async (ctx) => {
  const client = initApollo()
  try {
    const [
      {
        data: { consultationPortalCaseById },
      },
      {
        data: { consultationPortalAdviceByCaseId },
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
      client.query<CaseGetAdvicesByIdQuery, CaseGetAdvicesByIdQueryVariables>({
        query: CASE_GET_ADVICES_BY_ID,
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
        advices: consultationPortalAdviceByCaseId,
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
