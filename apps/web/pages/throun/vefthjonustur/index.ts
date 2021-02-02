import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import apiCatalogueScreen from '@island.is/web/screens/ApiCatalogue/ApiCatalogue'

export default withApollo(withLocale('is')(apiCatalogueScreen))
