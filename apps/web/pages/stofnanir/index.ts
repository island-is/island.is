import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import organizationsScreen from '@island.is/web/screens/Organizations/Organiziations'
import { withContentfulEditor } from '@island.is/contentful-editor'

import { environment } from '../../environments/environment'

export default withContentfulEditor(
  withApollo(withLocale('is')(organizationsScreen)),
  environment.contentful,
)
