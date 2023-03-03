import { withApollo } from '../graphql/withApollo'
import initApollo from '../graphql/client'
import {
  ConsultationPortalAllCasesQuery,
  ConsultationPortalAllCasesQueryVariables,
  ConsultationPortalAllCasesDocument,
} from '../screens/Home/getAllCases.generated'
import Home from '../screens/Home/Home'

interface HomeProps {
  cases: ConsultationPortalAllCasesQuery['consultationPortalAllCases']
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
