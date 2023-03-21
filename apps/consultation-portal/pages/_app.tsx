import App, { AppContext, AppProps } from 'next/app'
import AppLayout from '../components/AppLayout/AppLayout'
import UserContextProvider from '../context/UserContext'
import { parseCookie } from '../utils/helpers'

const ConsultationPortalApplication: any = ({
  Component,
  pageProps,
  token,
}) => {
  return (
    <UserContextProvider token={token}>
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </UserContextProvider>
  )
}

ConsultationPortalApplication.getInitialProps = async (
  appContext: AppContext,
) => {
  const pageProps = await App.getInitialProps(appContext)

  const cookiesParsed = parseCookie(appContext.ctx.req.headers.cookie)
  if (cookiesParsed) {
    if ('token' in cookiesParsed) {
      const token = cookiesParsed['token']
      return { ...pageProps, token }
    }
  }
  return { ...pageProps }
}

export default ConsultationPortalApplication
