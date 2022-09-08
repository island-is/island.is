import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import subPage from '@island.is/web/screens/Organization/SubPage'

/**
 * This page was added since syslumenn have a custom published material page set up in Contentful.
 * That page has the same slug as the new generic published material page for organizations, so that's why we explicitly added this route.
 */
export default withApollo(withLocale('is')(subPage))
