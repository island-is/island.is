import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import tellUsAStoryScreen from '@island.is/web/screens/TellUsAStory'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

const Screen = withApollo(withLocale('is')(tellUsAStoryScreen))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
