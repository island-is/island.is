import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

import withApollo from '../../graphql/withApollo'
import { withLocale } from '../../i18n'
import articleScreen from '../../screens/Article'

import '@island.is/api/mocks'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
const Screen = withApollo(withLocale('is')(articleScreen))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
