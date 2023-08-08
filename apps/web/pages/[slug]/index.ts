import '@island.is/api/mocks'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

import withApollo from '../../graphql/withApollo'
import { withLocale } from '../../i18n'
import articleScreen from '../../screens/Article'

const Screen = withApollo(withLocale('is')(articleScreen))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
