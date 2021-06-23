import '@island.is/api/mocks'

import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import ServicesPage from '@island.is/web/screens/Organization/Services'

export default withApollo(withLocale('is')(ServicesPage))
