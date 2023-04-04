import AppLayout from '../components/AppLayout/AppLayout'
import PageLoader from '../components/PageLoader/PageLoader'
import UserContextProvider from '../context/UserContext'

const ConsultationPortalApplication: any = ({ Component, pageProps }) => {
  return (
    <UserContextProvider>
      <AppLayout>
        <PageLoader />
        <Component {...pageProps} />
      </AppLayout>
    </UserContextProvider>
  )
}

export default ConsultationPortalApplication
