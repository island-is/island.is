import ContentWrapper from '../../../components/Layout/ContentWrapper'
import ResourcesTabsNav from '../../../components/Resource/nav/ResourcesTabsNav'
import React from 'react'
import ApiResourcesList from '../../../components/Resource/lists/ApiResourcesList'
import { GetServerSideProps, NextPageContext } from 'next'
import { withAuthentication } from './../../../utils/auth.utils'

const Index: React.FC = () => {
  return (
    <ContentWrapper>
      <ResourcesTabsNav />
      <ApiResourcesList />
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
