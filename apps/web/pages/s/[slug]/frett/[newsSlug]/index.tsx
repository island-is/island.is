import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import OrganizationNewsArticle from '@island.is/web/screens/Organization/OrganizationNewsArticle'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'
// @ts-ignore make web strict
const Screen = withApollo(withLocale('is')(OrganizationNewsArticle))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
