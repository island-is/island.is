import React, { useEffect } from 'react'
import ContentWrapper from './../../components/Layout/ContentWrapper'
import ClientBasicCreateForm from './../../components/Client/form/ClientBasicCreateForm'
import { Client } from './../../entities/models/client.model'
import { useRouter } from 'next/router'
import ClientDTO from './../../entities/dtos/client-dto'
import LocalizationUtils from '../../utils/localization.utils'

const Index: React.FC<React.PropsWithChildren<unknown>> = () => {
  const router = useRouter()
  const handleCancel = () => {
    router.back()
  }

  useEffect(() => {
    document.title = LocalizationUtils.getPageTitle('client.index')
  }, [])

  const handleClientSaved = (clientSaved: Client) => {
    if (clientSaved.clientId) {
      if (
        clientSaved.clientType !== 'spa' &&
        clientSaved.clientType !== 'native'
      ) {
        router.push(`/client/${clientSaved.clientId}?step=9`)
      } else {
        router.push(`/client/${clientSaved.clientId}?step=10`)
      }
    }
  }

  return (
    <ContentWrapper>
      <ClientBasicCreateForm
        handleCancel={handleCancel}
        client={new ClientDTO()}
        onNextButtonClick={handleClientSaved}
      />
    </ContentWrapper>
  )
}

export default Index
