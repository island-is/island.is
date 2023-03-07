import {
  ConsultationPortalCaseItemResult,
  QueryConsultationPortalCaseByIdArgs,
} from '@island.is/api/schema'
import initApollo from '../../graphql/client'
import CaseScreen from '../../screens/Case/Case'
import {
  ConsultationPortalCaseByIdQuery,
  ConsultationPortalCaseByIdDocument,
} from '../../screens/Case/getCase.generated'
import { GET_CASE_BY_ID } from '../../screens/Case/getCase'
import { Advice, Case } from '../../types/viewModels'
interface CaseProps {
  case: Case
  advices: Advice
}
const CaseDetails: React.FC<CaseProps> = ({ case: Case, advices }) => {
  return <CaseScreen chosenCase={Case} advices={advices} isLoggedIn={true} />
}
export default CaseDetails

export const getServerSideProps = async (ctx) => {
  const client = initApollo()
  const slug = parseInt(ctx.query.slug)
  const [
    {
      data: { consultationPortalCaseById },
    },
  ] = await Promise.all([
    client.query<
      ConsultationPortalCaseByIdQuery,
      QueryConsultationPortalCaseByIdArgs
    >({
      query: GET_CASE_BY_ID,
      variables: {
        input: {
          caseId: slug,
        },
      },
    }),
  ])
  return {
    props: { case: consultationPortalCaseById },
  }
}
