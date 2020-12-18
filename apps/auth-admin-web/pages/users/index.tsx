import UsersList from '../../components/UsersList';
import React from 'react';
import ContentWrapper from 'apps/auth-admin-web/components/common/ContentWrapper';

export default function Index() {
  return (
    <ContentWrapper>
      <UsersList></UsersList>
    </ContentWrapper>
  );
}
