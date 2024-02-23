import { AppContext, AppProps } from 'next/app'
import { IntlProvider } from 'react-intl'
import Layout from '../components/Layout/Layout'
import AuthProvider from '../components/AuthProvider/AuthProvider'
import { Provider, getSession } from 'next-auth/client'

const FormBuilderProviderApp: React.FC<AppProps> = ({
  Component,
  pageProps,
}) => {
  return (
    <IntlProvider
      locale="is"
      messages={{}}
      defaultLocale="is"
      onError={() => undefined}
    >
      <Provider session={pageProps.session} options={{ clientMaxAge: 120 }}>
        <AuthProvider>
          <Layout>
            <main className="app">
              <Component {...pageProps} />
            </main>
          </Layout>
        </AuthProvider>
      </Provider>
    </IntlProvider>
  )
}

export async function getInitialProps(appContext: AppContext) {
  const { ctx } = appContext
  const session = await getSession(ctx)
  return {
    pageProps: {
      session: session,
    },
  }
}

export default FormBuilderProviderApp
