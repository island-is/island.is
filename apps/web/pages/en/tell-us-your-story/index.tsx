import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import tellUsAStoryScreen from '@island.is/web/screens/TellUsAStory'
import { withContentfulEditor } from '@island.is/contentful-editor'

import { environment } from '../../../environments/environment'

export default withContentfulEditor(
  withApollo(withLocale('en')(tellUsAStoryScreen)),
  environment.contentful,
)
