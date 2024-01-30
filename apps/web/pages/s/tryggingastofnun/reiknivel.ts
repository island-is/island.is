import { withLocale } from '@island.is/localization'
import withApollo from '@island.is/web/graphql/withApollo'
import PensionCalculator from '@island.is/web/screens/Organization/SocialInsuranceAdministration/PensionCalculator'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
const Screen = withApollo(withLocale('is')(PensionCalculator))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
