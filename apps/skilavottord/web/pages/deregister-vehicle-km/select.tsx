import { Screen } from '@island.is/skilavottord-web/types'
import { withLocale } from '@island.is/skilavottord-web/i18n'
import { DeregisterSelectKm } from '@island.is/skilavottord-web/screens'
import { withApollo } from '@island.is/skilavottord-web/graphql/withApollo'

export default withApollo(withLocale('is')(DeregisterSelectKm as Screen))
