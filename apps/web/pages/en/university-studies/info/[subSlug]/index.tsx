import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import UniversitySubPage from '@island.is/web/screens/UniversitySearch/UniversitySubPage'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

const Screen = withApollo(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  withLocale('en')(UniversitySubPage),
)

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
