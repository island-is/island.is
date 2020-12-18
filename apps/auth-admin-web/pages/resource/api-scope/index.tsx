import ContentWrapper from 'apps/auth-admin-web/components/Layout/ContentWrapper';
import React from 'react';
import ApiScopeForm from '../../../components/Resource/ApiScopeForm';

export default function Index() {
  return (
    <ContentWrapper>
      <ApiScopeForm />
    </ContentWrapper>
  );
}
