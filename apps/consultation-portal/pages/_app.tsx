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

export default ConsultationPortalApplication
