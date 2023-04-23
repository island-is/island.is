import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import Auctions from '@island.is/web/screens/Organization/Syslumenn/Auctions'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

const Screen = withApollo(withLocale('is')(Auctions))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
