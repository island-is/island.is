import { Comparison } from '@island.is/web/components'
import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

const Screen = withApollo(withLocale('is')(Comparison))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
