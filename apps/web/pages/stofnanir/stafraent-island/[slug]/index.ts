import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import aboutSubScreen from '@island.is/web/screens/AboutSubPage/AboutSubPage'

export default withApollo(withLocale('is')(aboutSubScreen))
