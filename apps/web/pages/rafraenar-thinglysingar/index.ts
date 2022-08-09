import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import ElectronicRegistrations from '@island.is/web/screens/ElectronicRegistrations'

export default withApollo(withLocale('is')(ElectronicRegistrations))
