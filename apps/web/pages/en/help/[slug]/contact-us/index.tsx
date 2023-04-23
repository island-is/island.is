import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import serviceWebFormsPage from '@island.is/web/screens/ServiceWeb/Forms/Forms'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

const Screen = withApollo(withLocale('en')(serviceWebFormsPage))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
