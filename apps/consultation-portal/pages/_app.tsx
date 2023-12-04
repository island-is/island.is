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
            <style jsx global>{`
              @font-face {
                font-family: 'IBM Plex Sans';
                font-style: normal;
                font-weight: 300;
                font-display: swap;
                src: local('IBM Plex Sans Light'), local('IBMPlexSans-Light'),
                  url('/samradsgatt/fonts/ibm-plex/ibm-plex-sans-v7-latin-300.woff2')
                    format('woff2'),
                  url('/samradsgatt/fonts/ibm-plex/ibm-plex-sans-v7-latin-300.woff')
                    format('woff');
              }
              @font-face {
                font-family: 'IBM Plex Sans';
                font-style: normal;
                font-weight: 400;
                font-display: swap;
                src: local('IBM Plex Sans'), local('IBMPlexSans'),
                  url('/samradsgatt/fonts/ibm-plex/ibm-plex-sans-v7-latin-regular.woff2')
                    format('woff2'),
                  url('/samradsgatt/fonts/ibm-plex/ibm-plex-sans-v7-latin-regular.woff')
                    format('woff');
              }
              @font-face {
                font-family: 'IBM Plex Sans';
                font-style: italic;
                font-weight: 400;
                font-display: swap;
                src: local('IBM Plex Sans Italic'), local('IBMPlexSans-Italic'),
                  url('/samradsgatt/fonts/ibm-plex/ibm-plex-sans-v7-latin-italic.woff2')
                    format('woff2'),
                  url('/samradsgatt/fonts/ibm-plex/ibm-plex-sans-v7-latin-italic.woff')
                    format('woff');
              }
              @font-face {
                font-family: 'IBM Plex Sans';
                font-style: normal;
                font-weight: 500;
                font-display: swap;
                src: local('IBM Plex Sans Medium'), local('IBMPlexSans-Medium'),
                  url('/samradsgatt/fonts/ibm-plex/ibm-plex-sans-v7-latin-500.woff2')
                    format('woff2'),
                  url('/samradsgatt/fonts/ibm-plex/ibm-plex-sans-v7-latin-500.woff')
                    format('woff');
              }
              @font-face {
                font-family: 'IBM Plex Sans';
                font-style: normal;
                font-weight: 600;
                font-display: swap;
                src: local('IBM Plex Sans SemiBold'),
                  local('IBMPlexSans-SemiBold'),
                  url('/samradsgatt/fonts/ibm-plex/ibm-plex-sans-v7-latin-600.woff2')
                    format('woff2'),
                  url('/samradsgatt/fonts/ibm-plex/ibm-plex-sans-v7-latin-600.woff')
                    format('woff');
              }
            `}</style>
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
