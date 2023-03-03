import initApollo from '@island.is/consultation-portal/graphql/client'
import {
  ConsultationPortalAllCasesQuery,
  ConsultationPortalAllCasesQueryVariables,
  ConsultationPortalAllCasesDocument,
} from '@island.is/consultation-portal/screens/Home/getAllCases.generated'
import Home from '@island.is/consultation-portal/screens/Home/Home'
import { Case } from '@island.is/consultation-portal/types/interfaces'

interface HomeProps {
  cases: Case[]
}
export const getServerSideProps = async (ctx) => {
  const client = initApollo()
  const [
    {
      data: { consultationPortalAllCases },
    },
  ] = await Promise.all([
    client.query<
      ConsultationPortalAllCasesQuery,
      ConsultationPortalAllCasesQueryVariables
    >({
      query: ConsultationPortalAllCasesDocument,
    }),
  ])
  return {
    props: { cases: consultationPortalAllCases },
  }
}

export const Index = ({ cases }: HomeProps) => {
  return <Home cases={cases} />
}
export default Index
