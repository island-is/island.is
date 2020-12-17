import IdentityResourcesDTO from '../../models/dtos/identity-resources.dto';
import React from 'react';
import IdentityResourceForm from '../../components/IdentityResourceForm';
import ContentWrapper from 'apps/auth-admin-web/components/common/ContentWrapper';

export default function Index() {
  return (
    <ContentWrapper>
      <IdentityResourceForm resource={new IdentityResourcesDTO()} />
    </ContentWrapper>
  );
}
