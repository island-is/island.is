import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import Calculator from '@island.is/web/screens/Organization/Fiskistofa/Calculator'

export default withApollo(withLocale('is')(Calculator))
