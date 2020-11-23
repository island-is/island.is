import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import homeScreen from '@island.is/web/screens/Home'
import { withContentfulEditor } from '@island.is/contentful-editor'

import { environment } from '../../environments/environment'

export default withContentfulEditor(
  withApollo(withLocale('en')(homeScreen)),
  environment.contentful,
)
