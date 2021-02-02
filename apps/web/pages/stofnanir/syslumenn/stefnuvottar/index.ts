import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import StefnuvottarPage from '@island.is/web/screens/Syslumenn/Stefnuvottar'

export default withApollo(withLocale('is')(StefnuvottarPage))
