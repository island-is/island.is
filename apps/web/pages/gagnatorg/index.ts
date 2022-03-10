import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import openDataScreen from '@island.is/web/screens/OpenData/OpenData'

export default withApollo(withLocale('is')(openDataScreen))
