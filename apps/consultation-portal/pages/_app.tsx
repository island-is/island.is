import { ApolloProvider } from '@apollo/client'
import { getSession, Provider } from 'next-auth/client'
import { AppContext } from 'next/app'
import { AppLayout, PageLoader, AuthProvider } from '../components'
import initApollo from '../graphql/client'
import { IsSsrMobileContext } from '../context'

const ConsultationPortalApplication: any = ({ Component, pageProps }) => {
  return (
    <ApolloProvider client={initApollo(pageProps.apolloState)}>
      <Provider
        session={pageProps.session}
        options={{ clientMaxAge: 120, basePath: '/samradsgatt/api/auth' }}
      >
        <AuthProvider>
          <IsSsrMobileContext.Provider value={pageProps.isMobile}>
            <AppLayout>
              <PageLoader />
              <Component {...pageProps} />
            </AppLayout>
          </IsSsrMobileContext.Provider>
        </AuthProvider>
      </Provider>
    </ApolloProvider>
  )
}

ConsultationPortalApplication.getInitialProps = async (
  appContext: AppContext,
) => {
  const { ctx } = appContext
  const apolloClient = initApollo({})
  const customContext = {
    ...ctx,
    apolloClient,
  }
  const apolloState = apolloClient.cache.extract()
  const session = await getSession(customContext)

  const isServer = !!ctx.req
  const userAgent = isServer
    ? ctx.req.headers['user-agent']
    : navigator.userAgent
  const isMobile = /(iPad|iPhone|Android|Mobile)/i.test(userAgent) || false

  return {
    pageProps: {
      session: session,
      apolloState: apolloState,
      isMobile: isMobile,
    },
  }
}

export default ConsultationPortalApplication
