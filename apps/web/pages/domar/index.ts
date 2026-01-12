import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import VerdictsList from '@island.is/web/screens/Verdicts/VerdictsList'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
const Screen = withApollo(withLocale('is')(VerdictsList))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
