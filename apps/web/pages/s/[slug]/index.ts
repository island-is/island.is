import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import organizationPage from '@island.is/web/screens/Organization/Home'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'
// @ts-ignore make web strict
const Screen = withApollo(withLocale('is')(organizationPage))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
