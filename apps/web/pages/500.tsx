import withApollo from '../graphql/withApollo'
import { ErrorPage } from '../screens/Error'

// This page gets served when a server error occurs
// Reference: https://nextjs.org/docs/pages/building-your-application/configuring/error-handling
export default withApollo(() => {
  return <ErrorPage statusCode={500} />
})
