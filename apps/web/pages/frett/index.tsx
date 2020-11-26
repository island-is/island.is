import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import NewsListScreen from '@island.is/web/screens/NewsList'
import { withContentfulEditor } from '@island.is/contentful-editor'

export default withContentfulEditor(
  withApollo(withLocale('is')(NewsListScreen)),
)
