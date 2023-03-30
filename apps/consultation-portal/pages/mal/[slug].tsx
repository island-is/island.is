import { QueryConsultationPortalCaseByIdArgs } from '@island.is/api/schema'
import initApollo from '../../graphql/client'
import CaseScreen from '../../screens/Case/Case'
import { ConsultationPortalCaseByIdQuery } from '../../screens/Case/getCase.graphql.generated'
import { GET_CASE_BY_ID } from '../../screens/Case/getCase.graphql'
import { Advice, Case } from '../../types/viewModels'
import {
  ConsultationPortalAdviceByCaseIdQuery,
  ConsultationPortalAdviceByCaseIdQueryVariables,
} from '../../screens/Case/getAdvices.graphql.generated'
import { GET_ADVICES } from '../../screens/Case/getAdvices.graphql'
interface CaseProps {
  case: Case
  advices: Advice[]
}
const CaseDetails: React.FC<CaseProps> = ({ case: Case, advices }) => {
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
      client.query<
        ConsultationPortalCaseByIdQuery,
        QueryConsultationPortalCaseByIdArgs
      >({
        query: GET_CASE_BY_ID,
        variables: {
          input: {
            caseId: parseInt(ctx.query['slug']),
          },
        },
      }),
      client.query<
        ConsultationPortalAdviceByCaseIdQuery,
        ConsultationPortalAdviceByCaseIdQueryVariables
      >({
        query: GET_ADVICES,
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
