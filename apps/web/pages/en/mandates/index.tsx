import withApollo from '../../../graphql/withApollo'
import { withLocale } from '../../../i18n'
import Umbod from '../../../screens/Umbod/Umbod'
import { getServerSidePropsWrapper } from '../../../utils/getServerSidePropsWrapper'

const Screen = withApollo(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  withLocale('en')(Umbod),
)

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
