import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import NewsListScreen from '@island.is/web/screens/NewsList'

export default withApollo(withLocale('is')(withMainLayout(NewsListScreen)))
