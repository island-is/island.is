import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import PetitionView from '@island.is/web/screens/PetitionView/PetitionView'

export default withApollo(withLocale('is')(PetitionView))
