import { withApollo } from '../graphql/withApollo'
import { GetServerSideProps } from 'next'
import { useQuery } from '@apollo/client'
import { GET_ALL_CASES } from '../graphql/getAllCases'
import { GetAllCasesQuery, useGetAllCasesQuery } from '../graphql/schema'
import initApollo from '../graphql/client'

export const Test = (props) => {
  const { data, error, client, loading } = useGetAllCasesQuery({})
  if (loading) return <div>loading..</div>
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
