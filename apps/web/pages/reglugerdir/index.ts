import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import RegulationsHome from '@island.is/web/screens/Regulations/RegulationsHome'

export default withApollo(withLocale('is')(RegulationsHome))
