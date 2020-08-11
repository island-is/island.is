import { withLocale } from '@island.is/web/i18n'
import articleScreen from '../../../../screens/Article'
import { withApollo } from '@island.is/web/graphql'

export default withApollo(withLocale('en')(articleScreen))
