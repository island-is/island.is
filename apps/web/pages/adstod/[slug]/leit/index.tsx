import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import searchScreen from '@island.is/web/screens/ServiceWeb/Search/ServiceSearch'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

const Screen = withApollo(withLocale('is')(searchScreen))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
