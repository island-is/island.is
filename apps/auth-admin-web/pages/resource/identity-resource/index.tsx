import ContentWrapper from 'apps/auth-admin-web/components/Layout/ContentWrapper';
import React from 'react';
import IdentityResourceForm from '../../../components/Resource/IdentityResourceForm';

export default function Index() {
  return (
    <ContentWrapper>
      <IdentityResourceForm />
    </ContentWrapper>
  );
}
