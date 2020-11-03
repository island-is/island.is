import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import tellUsAStoryScreen from '@island.is/web/screens/TellUsAStory'

export default withApollo(withLocale('en')(tellUsAStoryScreen))
