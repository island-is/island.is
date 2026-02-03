import { withApollo } from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import SupremeCourtDeterminations from '@island.is/web/screens/SupremeCourt/Determinations/DeterminationList'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
const Screen = withApollo(withLocale('is')(SupremeCourtDeterminations))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
