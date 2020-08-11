import { withLocale } from '@island.is/web/i18n'
import NewsListScreen from '../../screens/NewsList'
import { withApollo } from '@island.is/web/graphql'

export default withApollo(withLocale('is')(NewsListScreen))
