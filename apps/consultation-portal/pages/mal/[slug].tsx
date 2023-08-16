import { QueryConsultationPortalCaseByIdArgs } from '@island.is/api/schema'
import initApollo from '../../graphql/client'
import CaseScreen from '../../screens/Case/Case'
import { CASE_GET_CASE_BY_ID } from '../../graphql/queries.graphql'
import { CaseGetCaseByIdQuery } from '../../graphql/queries.graphql.generated'
import { Case } from '../../types/interfaces'

interface CaseProps {
  case: Case
  caseId: number
}

const CaseDetails: React.FC<React.PropsWithChildren<CaseProps>> = ({
  case: Case,
  caseId,
}: CaseProps) => {
  return <CaseScreen chosenCase={Case} caseId={caseId} />
}
export default CaseDetails

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
