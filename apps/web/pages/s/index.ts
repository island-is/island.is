import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import organizationsScreen from '@island.is/web/screens/Organizations/Organizations'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

const Screen = withApollo(withLocale('is')(organizationsScreen))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
