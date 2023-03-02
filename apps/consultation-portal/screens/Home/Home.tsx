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
Home.getInitialProps = async ({ apolloClient, locale }) => {
  const [
    {
      data: { consultationPortalAllCases },
    },
  ] = await Promise.all([
    apolloClient.query<
      ConsultationPortalAllCasesQuery,
      ConsultationPortalAllCasesQueryVariables
    >({
      query: ConsultationPortalAllCasesDocument,
    }),
  ])

  return {
    cases: consultationPortalAllCases,
  }
}

export default Home
