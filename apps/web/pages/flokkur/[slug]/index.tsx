import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import categoryScreen from '@island.is/web/screens/Category/Category'
import { withContentfulEditor } from '@island.is/contentful-editor'

export default withContentfulEditor(
  withApollo(withLocale('is')(categoryScreen)),
)
