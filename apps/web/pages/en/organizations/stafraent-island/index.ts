import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import aboutScreen from '@island.is/web/screens/AboutPage/AboutPage'
import { withContentfulEditor } from '@island.is/contentful-editor'

export default withContentfulEditor(withApollo(withLocale('en')(aboutScreen)))
