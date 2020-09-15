import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import lifeEventScreen from '../../../screens/LifeEvent/LifeEvent'

export default withApollo(withLocale('is')(lifeEventScreen))
