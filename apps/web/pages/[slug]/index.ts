import { withLocale } from '@island.is/web/i18n'
import genericScreen from '../../screens/GenericPage/GenericPage'
import { withApollo } from '@island.is/web/graphql'

export default withApollo(withLocale('is')(genericScreen))
