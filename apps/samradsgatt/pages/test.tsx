import { withApollo } from '../graphql/withApollo'
import { GET_ALL_CASES } from '../graphql/getAllCases'
import initApollo from '../graphql/client'

export const Test = (props) => {
  return <div>Test</div>
}
export default withApollo(Test)

export const getServerSideProps = async (ctx) => {
  const apolloClient = initApollo()
  try {
    const test = await apolloClient.query({ query: GET_ALL_CASES })
  } catch (error) {
    console.error(error)
  }

  return {
    props: {},
  }
}
