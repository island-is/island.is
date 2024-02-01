import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import PensionCalculator from '@island.is/web/screens/Organization/SocialInsuranceAdministration/PensionCalculator'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
const Screen = withApollo(withLocale('en')(PensionCalculator))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
