import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import PetitionView from '@island.is/web/screens/PetitionView/PetitionView'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'
// @ts-ignore make web strict
const Screen = withApollo(withLocale('en')(PetitionView))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
