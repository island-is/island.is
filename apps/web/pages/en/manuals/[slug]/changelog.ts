import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import ManualChangelogScreen from '@island.is/web/screens/Manual/ManualChangelog'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
const Screen = withApollo(withLocale('en')(ManualChangelogScreen))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
