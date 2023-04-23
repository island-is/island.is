import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import categoryScreen from '@island.is/web/screens/Category/Category'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

const Screen = withApollo(withLocale('is')(categoryScreen))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
