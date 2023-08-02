import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import { Comparison } from '@island.is/web/screens/UniversitySearch/Comparison'

export default withApollo(withLocale('is')(Comparison))
