import { ApolloProvider } from '@apollo/client'
import { getSession, Provider } from 'next-auth/client'
import { AppContext } from 'next/app'
import { AppLayout, PageLoader, AuthProvider } from '../components'
import initApollo from '../graphql/client'
import { isAuthenticated } from '../utils/helpers'

const ConsultationPortalApplication: any = ({ Component, pageProps }) => {
  return (
    <ApolloProvider client={initApollo(pageProps.apolloState)}>
      <Provider
        session={pageProps.session}
        options={{ clientMaxAge: 120, basePath: '/samradsgatt/api/auth' }}
      >
        <AuthProvider>
          <AppLayout>
            <PageLoader />
            <Component {...pageProps.pageProps} />
          </AppLayout>
        </AuthProvider>
      </Provider>
    </ApolloProvider>
  )
}

ConsultationPortalApplication.getInitialProps = async (
  appContext: AppContext,
) => {
  const { Component, ctx } = appContext
  const apolloClient = initApollo({})
  const customContext = {
    ...ctx,
    apolloClient,
  }
  let pageProps
  if (Component.getInitialProps) {
    pageProps = (await Component.getInitialProps(customContext)) as any
  }
  const apolloState = apolloClient.cache.extract()
  const session = await getSession(ctx)
  return {
    pageProps: {
      session: session,
      isAuthenticated: isAuthenticated(ctx),
      apolloState: apolloState,
      pageProps: pageProps,
    },
  }
}

export default ConsultationPortalApplication
