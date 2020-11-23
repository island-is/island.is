import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import newsItemScreen from '@island.is/web/screens/NewsItem'
import { withContentfulEditor } from '@island.is/contentful-editor'

import { environment } from '../../../../environments/environment'

export default withContentfulEditor(
  withApollo(withLocale('en')(newsItemScreen)),
  environment.contentful,
)
