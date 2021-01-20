import '@island.is/api/mocks'

import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import suborganization from '@island.is/web/screens/Syslumenn/Suborganization'

export default withApollo(withLocale('is')(suborganization))
