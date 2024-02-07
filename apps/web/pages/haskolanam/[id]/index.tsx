import UniversitySearchDetails from '@island.is/web/screens/UniversitySearch/UniversitySearchDetails'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

import withApollo from '../../../graphql/withApollo'
import { withLocale } from '../../../i18n'

const Screen = withApollo(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  withLocale('is')(UniversitySearchDetails),
)

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
