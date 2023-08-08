import { getSession, Provider } from 'next-auth/client'
import { AppLayout, PageLoader, AuthProvider } from '../components'

const ConsultationPortalApplication: any = ({ Component, pageProps }) => {
  return (
    <Provider
      session={pageProps.session}
      options={{ basePath: '/samradsgatt/api/auth' }}
    >
      <AuthProvider>
        <AppLayout>
          <PageLoader />
          <Component {...pageProps} />
        </AppLayout>
      </AuthProvider>
    </Provider>
  )
}

ConsultationPortalApplication.getInitialProps = async ({ ctx }) => {
  const session = await getSession(ctx)

  return {
    pageProps: {
      session: session,
    },
  }
}

export default ConsultationPortalApplication
