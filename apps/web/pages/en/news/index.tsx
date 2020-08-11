import { withLocale } from '@island.is/web/i18n'
import newsListScreen from '../../../screens/NewsItem'
import { withApollo } from '@island.is/web/graphql'

export default withApollo(withLocale('en')(newsListScreen))
