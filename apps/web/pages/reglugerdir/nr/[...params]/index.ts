import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import RegulationPage from '@island.is/web/screens/Regulations/RegulationPage'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
const Screen = withApollo(withLocale('is')(RegulationPage))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
