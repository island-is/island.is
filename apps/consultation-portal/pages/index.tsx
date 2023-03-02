import withApollo from '@island.is/consultation-portal/graphql/withApollo'
import homeScreen from '@island.is/consultation-portal/screens/Home/Home'
import {
  ConsultationPortalAllCasesDocument,
  ConsultationPortalAllCasesQuery,
  ConsultationPortalAllCasesQueryVariables,
} from '@island.is/consultation-portal/screens/Home/getAllCases.generated'
import initApollo from '../graphql/client'
import { GetServerSidePropsContext } from 'next'
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  console.log('hall')
  const apolloClient = initApollo()
  let test2
  try {
    test2 = await apolloClient.query<
      ConsultationPortalAllCasesQuery,
      ConsultationPortalAllCasesQueryVariables
    >({ query: ConsultationPortalAllCasesDocument })
    console.log('test', test2)
  } catch (error) {
    console.error(error)
  }

  return {
    props: {
      data: test2,
    },
  }
}
export default withApollo(homeScreen)
