import React from 'react'
import ErrorScreen from '../screens/Error/Error'
import { getLocaleFromPath } from '../i18n/withLocale'
import Layout, { LayoutProps } from '../layouts/main'
import I18n, { Locale } from '../i18n/I18n'
import { withApollo } from '../graphql/withApollo'

type ErrorPageProps = {
  statusCode: number
  locale: Locale
  layoutProps: LayoutProps
}

class ErrorPage extends React.Component<ErrorPageProps> {
  state = { renderError: false }

  static getDerivedStateFromError(_error: Error) {
    // This means we had an error rendering the error page - We'll attempt to
    // render again with a simpler version
    return { renderError: true }
  }

  render() {
    if (this.props.layoutProps && !this.state.renderError) {
      // getDerivedStateFromError catches client-side render errors, but we need
      // try-catch for server-side rendering
      try {
        return (
          <I18n
            locale={this.props.locale}
            translations={this.props.layoutProps.namespace}
          >
            <Layout {...this.props.layoutProps}>
              <ErrorScreen statusCode={this.props.statusCode} />
            </Layout>
          </I18n>
        )
      } catch {}
    }

    // fallback to simpler version if we're unable to use the Layout for any reason
    return <ErrorScreen statusCode={this.props.statusCode} />
  }

  static async getInitialProps(props /*: NextPageContext*/) {
    const { err, res, asPath } = props
    const statusCode = err?.statusCode ?? res?.statusCode ?? 500
    const locale = getLocaleFromPath(asPath)

    // TODO: Next-js takes care of calling this function for any error that
    // occurs anywhere in the application, so this would probably be an ideal
    // place to add some error logging

    // Set the actual http resopnse code if rendering server-side
    if (res) {
      res.statusCode = statusCode
    }

    // we'll attempt to use the layout component, but if it goes wrong we'll
    // show a simplified error page without any header or footer
    let layoutProps = null
    try {
      layoutProps = await Layout.getInitialProps({ ...props, locale })
    } catch {}

    return { statusCode, locale, layoutProps }
  }
}

export default withApollo(ErrorPage)
