import UsersList from '../../components/User/UsersList';
import React from 'react';
import ContentWrapper from 'apps/auth-admin-web/components/Layout/ContentWrapper';

export default function Index() {
  return (
    <ContentWrapper>
      <UsersList></UsersList>
    </ContentWrapper>
  );
}
