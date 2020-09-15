import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import newsItemScreen from '@island.is/web/screens/NewsItem'

export default withApollo(withLocale('is')(withMainLayout(newsItemScreen)))
