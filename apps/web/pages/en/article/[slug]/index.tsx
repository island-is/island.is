import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import articleScreen from '@island.is/web/screens/Article'
import { withContentfulEditor } from '@island.is/contentful-editor'

export default withContentfulEditor(withApollo(withLocale('en')(articleScreen)))
