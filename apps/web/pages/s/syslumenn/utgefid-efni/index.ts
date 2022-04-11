import '@island.is/api/mocks'

import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import subPage from '@island.is/web/screens/Organization/SubPage'

/**
 * This page was added since syslumenn have already set up their published material
 * by creating an organization subpage filled with accordions and file links.
 *
 * That page has the same slug as the new generic published material page for organizations.
 *
 * This page will be removed in the future if syslumenn want to utilize the new generic published material page instead
 */
export default withApollo(withLocale('is')(subPage))
