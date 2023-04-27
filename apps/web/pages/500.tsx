import withApollo from '../graphql/withApollo'
import { ErrorPage } from '../screens/Error'

export default withApollo(() => {
  return <ErrorPage statusCode={500} />
})
