import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import RegulationPage from '@island.is/web/screens/Regulations/RegulationPage'

export default withApollo(withLocale('is')(RegulationPage))
