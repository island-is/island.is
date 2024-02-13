import { ApolloProvider } from '@apollo/client'
import { AppContext, AppProps } from 'next/app'
import { getSession, Provider } from 'next-auth/client'
import { IntlProvider } from 'react-intl'
import Layout from '../components/Layout/Layout'
import initApollo from '../gql/client'

const FormBuilderProviderApp: any = ({ Component, pageProps }: AppProps) => {
  return (
    // <ApolloProvider client={initApollo(pageProps.apolloState)}>
    //   <Provider
    //     session={pageProps.session}
    //   >
    <IntlProvider
      locale="is"
      messages={{}}
      defaultLocale="is"
      onError={() => undefined}
    >
      <Layout>
        <main className="app">
          <Component {...pageProps} />
        </main>
      </Layout>
    </IntlProvider>
    //   </Provider>
    // </ApolloProvider>
  )
}

// FormBuilderProviderApp.getInitialProps = async (appContext: AppContext) => {
//   const { ctx } = appContext
//   const apolloClient = initApollo({})
//   const customContext = {
//     ...ctx,
//     apolloClient,
//   }
//   const apolloState = apolloClient.cache.extract()
//   const session = await getSession(customContext)

//   return {
//     pageProps: {
//       session: session,
//       apolloState: apolloState
//     }
//   }
// }

export default FormBuilderProviderApp
