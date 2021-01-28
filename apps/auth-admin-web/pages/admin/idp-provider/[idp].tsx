import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ContentWrapper from '../../../components/Layout/ContentWrapper'
import { GetServerSideProps, NextPageContext } from 'next'
import { withAuthentication } from './../../../utils/auth.utils'
import { IdpProvider } from '../../../entities/models/IdpProvider.model'
import { IdpProviderService } from './../../../services/IdpProviderService'
import IdpProviderCreateForm from './../../../components/Admin/form/IdpProviderCreateForm'

const Index: React.FC = () => {
  const { query } = useRouter()
  const idpProviderName = query.idp
  const [idpProvider, setIdpProvider] = useState<IdpProvider>(new IdpProvider())
  const router = useRouter()

  /** Load the api Scope and set the step from query if there is one */
  useEffect(() => {
    async function loadIdp() {
      if (idpProviderName) {
        const decode = decodeURIComponent(idpProviderName as string)
        await getIdpProvider(decode)
      }
    }
    loadIdp()
  }, [idpProviderName])

  const getIdpProvider = async (idpName: string) => {
    const response = await IdpProviderService.findByName(idpName)
    if (response) {
      setIdpProvider(response)
    }
  }

  const handleCancel = () => {
    router.push('/admin/?tab=2')
  }

  const handleIdpSaved = (idpSaved: IdpProvider) => {
    if (idpSaved) {
      router.push('/admin/?tab=2')
    }
  }

  return (
    <ContentWrapper>
      <IdpProviderCreateForm
        idpProvider={idpProvider}
        handleCancel={handleCancel}
        handleSaveButtonClicked={handleIdpSaved}
      />
    </ContentWrapper>
  )
}
export default Index

export const getServerSideProps = withAuthentication(
  async (context: NextPageContext) => {
    return {
      props: {},
    }
  },
)
