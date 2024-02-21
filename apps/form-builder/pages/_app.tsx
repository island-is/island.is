import { AppProps } from 'next/app'
import { IntlProvider } from 'react-intl'
import Layout from '../components/Layout/Layout'

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
      <Layout>
        <main className="app">
          <Component {...pageProps} />
        </main>
      </Layout>
    </IntlProvider>
  )
}

export default FormBuilderProviderApp
