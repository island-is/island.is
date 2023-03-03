import initApollo from '@island.is/consultation-portal/graphql/client'
import { Screen } from '@island.is/consultation-portal/types'
import { GetServerSidePropsContext } from 'next'
import {
  ConsultationPortalAllCasesDocument,
  ConsultationPortalAllCasesQuery,
  ConsultationPortalAllCasesQueryVariables,
} from '../Home/getAllCases.generated'

interface HomeProps {
  cases: ConsultationPortalAllCasesQuery['consultationPortalAllCases']
}

const Home: Screen<HomeProps> = ({ cases }) => {
  return <div>Test</div>
}

export default Home
