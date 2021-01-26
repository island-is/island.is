import React from 'react'
import ContentWrapper from './../../components/Layout/ContentWrapper'
import { GetServerSideProps, NextPageContext } from 'next'
import { withAuthentication } from './../../utils/auth.utils'
import AdminUsersList from './../../components/Admin/lists/AdminUsersList'

const Index: React.FC = () => {
  return (
    <ContentWrapper>
      <AdminUsersList />
    </ContentWrapper>
  )
}

export const getServerSideProps = withAuthentication(
  async (context: NextPageContext) => {
    return {
      props: {},
    }
  },
)

export default Index
