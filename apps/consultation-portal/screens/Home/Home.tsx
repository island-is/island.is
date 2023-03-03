import initApollo from '@island.is/consultation-portal/graphql/client'
import { Screen } from '@island.is/consultation-portal/types'
import { GetServerSidePropsContext } from 'next'
import {
  ConsultationPortalAllCasesDocument,
  ConsultationPortalAllCasesQuery,
  ConsultationPortalAllCasesQueryVariables,
} from './getAllCases.generated'

interface HomeProps {
  cases: ConsultationPortalAllCasesQuery['consultationPortalAllCases']
}

const Home: Screen<HomeProps> = ({ cases }) => {
  console.log('ello', cases)
  return <div>Test</div>
}
Home.getInitialProps = async ({ apolloClient }) => {
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
    cases: consultationPortalAllCases,
  }
}

export default Home
