import React from 'react'
import ContentWrapper from './../../../components/Layout/ContentWrapper'
import IdentityResourceCreateForm from '../../../components/Resource/forms/IdentityResourceCreateForm'
import IdentityResourceDTO from '../../../entities/dtos/identity-resource.dto'
import { useRouter } from 'next/router'
import ResourcesTabsNav from '../../../components/Resource/nav/ResourcesTabsNav'
import { GetServerSideProps, NextPageContext } from 'next'
import { withAuthentication } from './../../../utils/auth.utils'

const Index: React.FC = () => {
  const router = useRouter()
  const handleSave = (data: IdentityResourceDTO) => {
    router.push(
      `/resource/identity-resource/${encodeURIComponent(data.name)}?step=2`,
    )
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <ContentWrapper>
      <ResourcesTabsNav />
      <IdentityResourceCreateForm
        identityResource={new IdentityResourceDTO()}
        handleSave={handleSave}
        handleCancel={handleCancel}
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
