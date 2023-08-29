import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import openDataScreen from '@island.is/web/screens/OpenData/OpenData'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'
// @ts-ignore make web strict
const Screen = withApollo(withLocale('is')(openDataScreen))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
