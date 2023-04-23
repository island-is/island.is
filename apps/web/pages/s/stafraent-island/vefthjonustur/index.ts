import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import ApiCatalogue from '@island.is/web/screens/Organization/StafraentIsland/ApiCatalogue'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

const Screen = withApollo(withLocale('is')(ApiCatalogue))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
