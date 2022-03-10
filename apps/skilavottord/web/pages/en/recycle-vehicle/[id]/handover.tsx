import { Screen } from '@island.is/skilavottord-web/types'
import { withLocale } from '@island.is/skilavottord-web/i18n'
import { Handover } from '@island.is/skilavottord-web/screens'
import { withApollo } from '@island.is/skilavottord-web/graphql/withApollo'
import { withGDPR } from '@island.is/skilavottord-web/components'

export default withApollo(withLocale('en')(withGDPR(Handover as Screen)))
