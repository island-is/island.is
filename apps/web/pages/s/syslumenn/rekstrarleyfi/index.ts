import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import OperatingLicenses from '@island.is/web/screens/Organization/Syslumenn/OperatingLicenses'

export default withApollo(withLocale('is')(OperatingLicenses))
