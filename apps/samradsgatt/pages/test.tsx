import { withApollo } from '../graphql/withApollo'
import { GetServerSideProps } from 'next'
import { useQuery } from '@apollo/client'
import { GET_ALLL_CASES } from '../graphql/getAllCases'
import { GetAllCasesQuery } from '../graphql/schema'
import initApollo from '../graphql/client'

export const Test = (props) => {
  return <div>Test</div>
}
export default withApollo(Test)

export const getServerSideProps = async (ctx) => {
  const apolloClient = initApollo({})
  try {
    const me = await apolloClient.query({ query: GET_ALLL_CASES })
  } catch (error) {
    console.error(error)
  }

  return {
    props: {},
    //props //: me,
  }
}
