import ClientDTO from './../../entities/dtos/client-dto'
import ClientForm from '../../components/Client/form/ClientForm'
import React from 'react'
import { useRouter } from 'next/router'
import ContentWrapper from './../../components/Layout/ContentWrapper'
import { GetServerSideProps, NextPageContext } from 'next'
import { withAuthentication } from './../../utils/auth.utils'

const Index: React.FC = () => {
  const router = useRouter()
  const handleCancel = () => {
    router.back()
  }

  const handleClientSaved = (clientSaved: ClientDTO) => {
    if (clientSaved.clientId) {
      router.push(`/client/${clientSaved.clientId}?step=2`)
    }
  }

  return (
    <ContentWrapper>
      <ClientForm
        handleCancel={handleCancel}
        client={new ClientDTO()}
        onNextButtonClick={handleClientSaved}
      />
    </ContentWrapper>
  )
}
export default Index

export const getServerSideProps: GetServerSideProps = withAuthentication(
  async (context: NextPageContext) => {
    return {
      props: {},
    }
  },
)
