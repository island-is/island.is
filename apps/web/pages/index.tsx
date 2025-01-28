import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import homeScreen from '@island.is/web/screens/Home/Home'

import { getServerSidePropsWrapper } from '../utils/getServerSidePropsWrapper'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
const Screen = withApollo(withLocale('is')(homeScreen))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
