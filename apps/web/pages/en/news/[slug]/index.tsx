import { withLocale } from '@island.is/web/i18n'
import newsItemScreen from '../../../../screens/NewsItem'
import { withApollo } from '@island.is/web/graphql'

export default withApollo(withLocale('en')(newsItemScreen))
