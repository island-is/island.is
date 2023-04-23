import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import projectScreen from '@island.is/web/screens/Project/Project'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

const Screen = withApollo(withLocale('is')(projectScreen))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
