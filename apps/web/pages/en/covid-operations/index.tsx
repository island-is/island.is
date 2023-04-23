import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import adgerdirHomeScreen from '@island.is/web/screens/Adgerdir/Home'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

const Screen = withApollo(withLocale('en')(adgerdirHomeScreen))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
