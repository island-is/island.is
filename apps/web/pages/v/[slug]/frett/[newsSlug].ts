import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import ProjectNewsArticle from '@island.is/web/screens/Project/ProjectNewsArticle'

export default withApollo(withLocale('is')(ProjectNewsArticle))
