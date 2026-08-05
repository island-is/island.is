import OpenDataDetailsPage from '@island.is/web/screens/OpenData/Details/Details'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

import withApollo from '../../../graphql/withApollo'
import { withLocale } from '../../../i18n'

const Screen = withApollo(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  withLocale('is')(OpenDataDetailsPage),
)

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
