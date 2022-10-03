import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import OrganizationNewsArticle from '@island.is/web/screens/Organization/OrganizationNewsArticle'

export default withApollo(withLocale('en')(OrganizationNewsArticle))
