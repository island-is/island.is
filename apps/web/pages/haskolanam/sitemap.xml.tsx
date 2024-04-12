import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import Sitemap from '@island.is/web/screens/UniversitySearch/Sitemap'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

const Screen = withApollo(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  withLocale('is')(Sitemap),
)

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
