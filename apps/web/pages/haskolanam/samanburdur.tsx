import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'
import Comparison from '@island.is/web/screens/UniversitySearch/Comparison'

const Screen = withApollo(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  withLocale('is')(Comparison),
)

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
