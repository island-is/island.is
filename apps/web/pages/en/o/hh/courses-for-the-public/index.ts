import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import { Component } from '@island.is/web/pages/s/hh/namskeid-fyrir-almenning/index'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
const Screen = withApollo(withLocale('en')(Component))

export default Screen

export const getServerSideProps = getServerSidePropsWrapper(Screen)
