import initApollo from '../graphql/client'
import {
  ConsultationPortalAllCasesQuery,
  ConsultationPortalAllCasesQueryVariables,
  ConsultationPortalAllCasesDocument,
} from '../screens/Home/getAllCases.graphql.generated'
import Home from '../screens/Test/Home'

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
  console.log(consultationPortalAllCases)
  return {
    props: { cases: consultationPortalAllCases },
  }
}

export const Test = ({ cases }: HomeProps) => {
  return <Home cases={cases} />
}
export default Test
