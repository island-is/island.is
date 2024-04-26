import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import AnchorPageScreen from '@island.is/web/screens/AnchorPage/AnchorPage'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
const Screen = withApollo(withLocale('en')(AnchorPageScreen))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
