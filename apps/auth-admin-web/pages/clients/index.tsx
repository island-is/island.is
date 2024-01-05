import React, { useEffect } from 'react'
import ContentWrapper from './../../components/Layout/ContentWrapper'
import ClientsList from '../../components/Client/lists/ClientsList'
import LocalizationUtils from '../../utils/localization.utils'

const Index: React.FC<React.PropsWithChildren<unknown>> = () => {
  useEffect(() => {
    document.title = LocalizationUtils.getPageTitle('clients.index')
  }, [])

  return (
    <ContentWrapper>
      <ClientsList />
    </ContentWrapper>
  )
}

export default Index
