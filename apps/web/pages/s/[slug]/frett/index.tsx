import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import OrganizationNewsList from '@island.is/web/screens/Organization/OrganizationNewsList'

export default withApollo(withLocale('is')(OrganizationNewsList))
