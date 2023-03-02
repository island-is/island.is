import { withApollo } from '../graphql/withApollo'
// import { GET_ALL_CASES } from '../screens/Home/getAllCases'
import initApollo from '../graphql/client'

export const Test = (props) => {
  return <div>Test</div>
}
export default withApollo(Test)

export const getServerSideProps = async (ctx) => {
  return {
    props: {},
  }
}
