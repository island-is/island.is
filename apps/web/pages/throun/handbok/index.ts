import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import developerHandbookScreen from '@island.is/web/screens/DeveloperHandbook/DeveloperHandbook'

export default withApollo(withLocale('is')(developerHandbookScreen))
