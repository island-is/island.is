import UsersList from '../../components/User/lists/UsersList'
import React, { useEffect } from 'react'
import ContentWrapper from './../../components/Layout/ContentWrapper'
import LocalizationUtils from '../../utils/localization.utils'

const Index: React.FC = () => {
  useEffect(() => {
    document.title = LocalizationUtils.getPageTitle('users.index')
  }, [])

  return (
    <ContentWrapper>
      <UsersList></UsersList>
    </ContentWrapper>
  )
}
export default Index
