import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import Homestay from '@island.is/web/screens/Organization/Syslumenn/Homestay'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

const Screen = withApollo(withLocale('is')(Homestay))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
