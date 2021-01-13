import ContentWrapper from '../../../components/Layout/ContentWrapper'
import ResourcesTabsNav from '../../../components/Resource/nav/ResourcesTabsNav'
import React from 'react'
import IdentityResourcesList from '../../../components/Resource/lists/IdentityResourcesList'
import { GetServerSideProps, NextPageContext } from 'next'
import { withAuthentication } from './../../../utils/auth.utils'

const Index: React.FC = () => {
  return (
    <ContentWrapper>
      <ResourcesTabsNav />
      <IdentityResourcesList />
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
