import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import serviceWebFormsPage from '@island.is/web/screens/ServiceWeb/Forms/Forms'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'
// @ts-ignore make web strict
const Screen = withApollo(withLocale('is')(serviceWebFormsPage))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
