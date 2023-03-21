import App, { AppContext, AppProps } from 'next/app'
import AppLayout from '../components/AppLayout/AppLayout'
import UserContextProvider from '../context/UserContext'

const ConsultationPortalApplication: any = ({ Component, pageProps }) => {
  return (
    <UserContextProvider>
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

  return { ...pageProps }
}

export default ConsultationPortalApplication
