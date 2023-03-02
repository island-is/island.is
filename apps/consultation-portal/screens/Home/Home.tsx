import initApollo from '@island.is/consultation-portal/graphql/client'
import { Screen } from '@island.is/consultation-portal/types'
import { GetServerSidePropsContext } from 'next'
import {
  ConsultationPortalAllCasesDocument,
  ConsultationPortalAllCasesQuery,
  ConsultationPortalAllCasesQueryVariables,
} from './getAllCases.generated'

interface HomeProps {
  data: any
}

const Home: Screen<HomeProps> = ({ data }) => {
  console.log('ello', data)
  return <div>Test</div>
}

export default Home
