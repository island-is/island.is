import React from 'react';
import ContentWrapper from './../../../components/Layout/ContentWrapper';
import IdentityResourceCreateForm from '../../../components/Resource/components/forms/IdentityResourceCreateForm';
import IdentityResourcesDTO from './../../../entities/dtos/identity-resources.dto';
import { useRouter } from 'next/router';

export default function Index() {
  const router = useRouter();
  const handleSave = (data: IdentityResourcesDTO) => {
    router.push(`edit/identity-resource/${data.name}?step=2`);
  }

  const handleCancel = () => {
    router.back();
  }

  return (
    <ContentWrapper>
      <IdentityResourceCreateForm identityResource={new IdentityResourcesDTO()} handleSave={handleSave} handleCancel={handleCancel} />
    </ContentWrapper>
  );
}
