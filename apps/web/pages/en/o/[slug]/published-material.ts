import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import PublishedMaterial from '@island.is/web/screens/Organization/PublishedMaterial'

export default withApollo(withLocale('en')(PublishedMaterial))
