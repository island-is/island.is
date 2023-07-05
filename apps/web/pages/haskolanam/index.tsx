import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import UniversitySearch from '@island.is/web/screens/UniversitySearch/UniversitySearch'

export default withApollo(withLocale('is')(UniversitySearch))
