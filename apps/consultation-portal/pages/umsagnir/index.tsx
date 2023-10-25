import { withApollo } from '../../graphql/withApollo'
import Advices from '../../screens/Advices/Advices'

export const Index = () => {
  return <Advices />
}

export default withApollo(Index)
