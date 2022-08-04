import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import SpecialistArrivals from '@island.is/web/screens/Organization/HeilbrigdisstofnunNordurlands/SpecialistArrivals'

export default withApollo(withLocale('is')(SpecialistArrivals))
