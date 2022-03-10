import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import projectScreen from '@island.is/web/screens/Project/Project'

export default withApollo(withLocale('en')(projectScreen))
