import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import searchScreen from '@island.is/web/screens/Search/Search'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

const Screen = withApollo(withLocale('en')(searchScreen))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
